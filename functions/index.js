const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const axios = require("axios");
const xml2js = require("xml2js");
const cors = require("cors")({ origin: true });
const functions = require("firebase-functions");

const API_KEY = "AIzaSyDwRHpWwtp7Xk4zol_XYzTPeYFnYXE98Ic";

const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};

exports.getPaginatedData = onRequest(async (req, res) => {
  try {
      const { page, url } = req.query;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/xml",
        },
        timeout: 10000,
      });
      xml2js.parseString(response.data, (err, result) => {
        if (err) {
          console.error("Error parsing XML", err);
          return res.status(500).send("Error parsing XML");
        }

        const items = result?.rss?.channel?.[0]?.item;
        const descriptionHtml = result?.rss?.channel?.[0]?.description?.[0];
        const pageNumber = parseInt(page) || 1;
        const pageSize = 10;
        const paginatedItems = paginate(items, pageSize, pageNumber);

        res.status(200).json({
          page: pageNumber,
          pageSize,
          description: descriptionHtml,
          totalItems: items.length,
          totalPages: Math.ceil(items.length / pageSize),
          data: paginatedItems,
        });
      });
    } catch (error) {
      console.error("Error calling external API", error);
      res.status(500).send("Error calling external API");
    }
});

const getChannelIdForCustom = async (name) => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(
    name
  )}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id.channelId;
    } else {
      console.log("No channels found with that name.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching channel ID:", error);
    return null;
  }
};

exports.addChannel = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { name, channelLink } = req.body;
      const parts = channelLink.split("/");
      const channelSlug = parts[parts.length - 1];
      var channelId = channelSlug;
      if (channelSlug.includes('@')) {
        channelId=await getChannelIdForCustom(channelSlug)
      }
      if (!name || !channelLink || !channelId) {
        return res.status(400).send("Name and channelLink are required");
      }
      const docRef = await db.collection("channels").add({ name, channelLink:channelId });
      res.status(201).send("Document added Successfully");
    } catch (error) {
      console.error("Error adding channel:", error);
      res.status(400).send("Error adding channel: " + error.message);
    }
  });
});

exports.getChannels = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const snapshot = await db.collection("channels").get();
      const channels = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.status(200).json({ channels: channels });
    } catch (error) {
      res.status(400).send("Error getting channels: " + error.message);
    }
  });
});

exports.updateChannel = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { channelName, ...data } = req.body;
      const channelsRef = db.collection("channels");
      const query = channelsRef.where("name", "==", channelName);
      const querySnapshot = await query.get();
      if (querySnapshot.empty) {
        return res
          .status(404)
          .send("No channel found with the specified channelId");
      }
      querySnapshot.forEach(async (doc) => {
        await doc.ref.update(data);
      });
      res.status(200).send("Channel updated successfully");
    } catch (error) {
      res.status(400).send("Error updating channel. " + error.message);
    }
  });
});

exports.deleteChannel = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { channelName } = req.body;
      const channelsRef = db.collection("channels");
      const query = channelsRef.where("name", "==", channelName);
      const querySnapshot = await query.get();
      if (querySnapshot.empty) {
        return res
          .status(404)
          .send("No channel found with the specified channelLink");
      }
      querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
      res.status(200).send("Channel deleted successfully");
    } catch (error) {
      res.status(400).send("Error deleting channel: " + error.message);
    }
  });
});

const fetchChannelRSSFeed = async (channelId) => {
  const rssFeedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try {
    const response = await axios.get(rssFeedUrl);
    const xml = response.data;
    const parseXML = async (xml) => {
      try {
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xml);
        const entries = result.feed.entry;

        const sortedEntries = entries.sort(
          (a, b) => new Date(b.published[0]) - new Date(a.published[0])
        );

        const latestFive = sortedEntries.slice(0, 5);

        const videosData = latestFive.map((entry) => ({
          title: entry.title[0],
          url: entry.link[0].$.href,
          thumbnail: entry["media:group"][0]["media:thumbnail"][0].$.url,
          publishedAt: new Date(entry.published[0]),
          channelUrl: `https://www.youtube.com/channel/${channelId}`,
        }));

        return videosData;
      } catch (error) {
        console.error("Error parsing XML:", error);
        return [];
      }
    };
    return await parseXML(xml);
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return [];
  }
};

const clearVideoDataInDB = async () => {
  const snapshot = await db.collection("videos").get();

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref); // Mark each document for deletion
  });

  await batch.commit(); // Commit the batch to delete all documents
  console.log("All previous video data cleared from the database");
};

const storeVideoDataInDB = async (videosData) => {
  if (videosData) {
    await clearVideoDataInDB();
    const batch = db.batch();
    videosData.forEach((video) => {
      const sanitizedDocId = video.url.replace(/[^a-zA-Z0-9-_]/g, "_");
      const videoRef = db.collection("videos").doc(sanitizedDocId);
      batch.set(videoRef, video);
    });
    await batch.commit();
    console.log("Video data saved successfully");
  }
};

exports.scheduledFetchVideos = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async (context) => {
    console.log("Fetching and storing latest channel data...");
    try {
      const snapshot = await db.collection("channels").get();

      const channelIds = snapshot.docs.map((doc) => doc.data().channelLink);
      console.log("channelID============", channelIds);
      const videoData = [];
      for (const channelId of channelIds) {
        const channelVideos = await fetchChannelRSSFeed(channelId);
        videoData.push(...channelVideos);
      }
      console.log("Videos",videoData);
      const sortedData = videoData.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );

      await storeVideoDataInDB(sortedData);
    } catch (error) {
      console.error("Error fetching or storing video data:", error);
    }
  });

exports.getPaginatedVideos = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const { page = 1 } = req.query;
      const pageSize = 10;

      const totalSnapshot = await db.collection("videos").get();
      const totalDocuments = totalSnapshot.size;
      const totalPages = Math.ceil(totalDocuments / pageSize);
      const skip = (Number(page) - 1) * pageSize;

      const videosRef = db.collection("videos").orderBy("publishedAt", "desc");

      let query = videosRef.limit(pageSize);

      if (skip > 0) {
        const snapshot = await videosRef.limit(skip).get();
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];

        query = query.startAfter(lastVisible);
      }

      const snapshot = await query.get();

      const videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      res.status(200).json({ videos:videos, totalPages:totalPages });
    } catch (error) {
      res.status(500).send("Error retrieving videos: " + error.message);
    }
  })
});
