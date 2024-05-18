import mongoose, { Schema, Document } from "mongoose";

export interface Chapter extends Document {
	_id: mongoose.ObjectId | string;
	title: string;
	description: string;
	pdfURL: string;
	videoURL: string;
	isPublished: boolean;
}

export const ChapterSchema: Schema<Chapter> = new Schema({
	title: {
		type: String,
		required: [true, "Session name is required"],
	},
	description: {
		type: String,
	},
	pdfURL: String,
	videoURL: String,
	isPublished: { type: Boolean, default: false },
});

export const ChapterModel =
	(mongoose.models.Chapter as mongoose.Model<Chapter>) ||
	mongoose.model<Chapter>("Chapter", ChapterSchema);

export interface Course extends Document {
	_id: mongoose.ObjectId | string;
	title: string;
	description: string;
	chapters: Chapter[] | mongoose.ObjectId[];
	imageURL: string;
	createdAt: Date;
	isPublished: boolean;
}

const CourseSchema: Schema<Course> = new Schema({
	title: {
		type: String,
		required: [true, "Course name is required"],
		unique: true,
	},
	description: String,
	chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
	imageURL: String,
	createdAt: Date,
	isPublished: {
		type: Boolean,
		default: false,
	},
});

export const CourseModel =
	(mongoose.models.Course as mongoose.Model<Course>) ||
	mongoose.model<Course>("Course", CourseSchema);

export interface User extends Document {
	_id: mongoose.ObjectId | string;
	userid: string;
	password: string;
	role: "admin" | "user";
	course: mongoose.ObjectId | Course;
}

const UserSchema: Schema<User> = new Schema({
	userid: {
		type: String,
		required: [true, "Userid is required"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		select: false,
	},
	role: {
		type: String,
		enum: ["user", "admin"],
		default: "user",
	},
	course: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Course",
	},
});

const UserModel =
	(mongoose.models.User as mongoose.Model<User>) ||
	mongoose.model<User>("User", UserSchema);

export default UserModel;
