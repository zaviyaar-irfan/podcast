const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const axios = require("axios");
const xml2js = require("xml2js");

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

exports.addChannel = onRequest(async (req, res) => {
  try {
    const { name, channelLink } = req.body;
    const docRef = await db
      .collection("channels")
      .add({ name, channelLink });
    res.status(201).send("Document added Successfully");
  } catch (error) {
    res.status(400).send("Error adding channel: " + error.message);
  }
});

exports.getChannels = onRequest(async (req, res) => {
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


exports.updateChannel = onRequest(async (req, res) => {
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

exports.deleteChannel = onRequest(async (req, res) => {
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


const updateChannel = async () => {
  try {
    const response = await axios.post(
      "https://updatechannel-53ifvdv3fa-uc.a.run.app",
      {
        channelName: "present name",
        name: "updated channel name", //optional
        channelLink: "updated channel link" //optional
      }
    );
  } catch (error) {
    console.error("Error updating channel:", error);
  }
};

const addChannel = async () => {
  try {
    const response = await axios.post(
      "https://addchannel-53ifvdv3fa-uc.a.run.app",
      {
        name: "channel name",
        channelLink: "channel link",
      }
    );
    console.log("Channel added:", response.data);
  } catch (error) {
    console.error("Error adding channel:", error);
  }
};

const getChannels = async () => {
  try {
    const response = await axios.post(
      "https://getchannels-53ifvdv3fa-uc.a.run.app"
    );
    console.log('Channels:', response.data);
  } catch (error) {
    console.error('Error getting channels:', error);
  }
};

const deleteChannel = async () => {
  try {
    const response = await axios.post(
      "https://deletechannel-53ifvdv3fa-uc.a.run.app",
      {
        channelName: "channel name",
      }
    );
    console.log("Channel deleted:", response.data);
  } catch (error) {
    console.error("Error deleting channel:", error);
  }
};