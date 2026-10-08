import mongoose, { Schema } from 'mongoose'
import type { InferSchemaType, Model } from 'mongoose'

const ThumbnailUrlsSchema = new Schema(
  {
    small: String,
    medium: String,
    large: String,
  },
  { _id: false }
)

const VideoDbSchema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: {
      type: new Schema(
        {
          trending: ThumbnailUrlsSchema,
          regular: ThumbnailUrlsSchema,
        },
        { _id: false }
      ),
      required: true,
    },
    year: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: String, required: true },
    isBookmarked: { type: Boolean, required: true },
    isTrending: { type: Boolean, required: true },
  },
  // Keep the collection name used by the existing data.
  { collection: 'Video', versionKey: false }
)

type VideoDoc = InferSchemaType<typeof VideoDbSchema>

// Reuse the compiled model across dev hot reloads.
const existing = mongoose.models.Video as Model<VideoDoc> | undefined

export const VideoModel =
  existing ?? mongoose.model<VideoDoc>('Video', VideoDbSchema)
