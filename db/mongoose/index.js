var mongoose = require("mongoose");
const format = require("util").format;
const {
  MONGO_CONNECTION_TYPE,
  MONGO_HOST,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_DATABASE
} = process.env;

const mongo_uri = format(
  MONGO_CONNECTION_TYPE,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST,
  MONGO_INITDB_DATABASE
);
console.error(mongo_uri);
const db = mongoose.createConnection(
  mongo_uri,
  {
    dbName: MONGO_INITDB_DATABASE,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  },
  err => {
    if (err) {
      console.log(`Mongoose Error: ${err}`);
    }
  }
);

const CouncilTemplate = new mongoose.Schema({
  meeting_hour: { type: Number, default: 12 },
  meeting_minutes: { type: Number, default: 0 },
  meeting_timezone: { type: String, default: "America/Los_Angeles" },
  meeting_sections: { type: [String] }
});

const CouncilSchema = new mongoose.Schema({
  council_name: { type: String, required: true },
  council_template: { type: CouncilTemplate, default: null },
  members: { type: [String] },
  image: { type: String, required: false }
});

const SponsorSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  position: { type: String },
  office: { type: String }
});

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  extendedTitle: { type: String, required: false },
  sponsors: { type: [SponsorSchema], required: false },
  body: { type: String } // markdown
});

const SectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  items: { type: [ItemSchema] }
});

const MeetingTypeSchema = new mongoose.Schema({
  name: { type: String }
});

const AgendaSchema = new mongoose.Schema({
  council: { type: CouncilSchema },
  sections: { type: [SectionSchema] },
  meeting_type: { type: MeetingTypeSchema }
});

const councils = db.model("councils", CouncilSchema, "councils");
const agendas = db.model("company", AgendaSchema, "company");

module.exports = {
  councils,
  agendas,
  ObjectId: mongoose.Types.ObjectId
};
