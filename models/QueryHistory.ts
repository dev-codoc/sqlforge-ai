import mongoose, { Schema, Document } from "mongoose";

export interface QueryBreakdown {
    part: string;
    desc: string;
}

export interface IQueryHistory extends Document {
    schemaId: mongoose.Types.ObjectId;
    prompt: string;
    sql: string;
    explanation?: string;
    breakdown?: QueryBreakdown[];
    warnings?: string[];
    rowCount?: number;
    executionTimeMs?: number;
    userId: string;
    executedAt: Date;
}

const BreakdownSchema: Schema = new Schema<QueryBreakdown>({
    part: { type: String, required: true },
    desc: { type: String, required: true }
}, { _id: false });

const QueryHistorySchema: Schema = new Schema<IQueryHistory>({
    schemaId: { type: Schema.Types.ObjectId, ref: "Schema", required: true, index: true },
    prompt: { type: String, required: true },
    sql: { type: String, required: true },
    explanation: { type: String },
    breakdown: { type: [BreakdownSchema], default: [] },
    warnings: { type: [String], default: [] },
    rowCount: { type: Number },
    executionTimeMs: { type: Number },
    userId: { type: String, required: true },
    executedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.QueryHistory || mongoose.model<IQueryHistory>("QueryHistory", QueryHistorySchema);