import mongoose, { Schema, Document } from "mongoose";

export interface TableColumn {
    name: string;
    type: string;
    nullable: boolean;
    primaryKey?: boolean;
    foreignKey?: string;
}

export interface ParsedTable {
    name: string;
    columns: TableColumn[];
}

export interface ISchema extends Document {
    name: string;
    ddl: string;
    tables: ParsedTable[];
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

const ColumnSchema: Schema = new Schema<TableColumn>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    nullable: { type: Boolean, required: true },
    primaryKey: { type: Boolean, default: false },
    foreignKey: { type: String, optional: true }
}, { _id: false });

const TableSchema = new Schema<ParsedTable>({
    name: { type: String, required: true },
    columns: { type: [ColumnSchema], required: true }
}, { _id: false });

const SchemaSchema: Schema = new Schema<ISchema>({
    name: { type: String, required: true },
    ddl: { type: String, required: true },
    tables: { type: [TableSchema], required: true },
    userId: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Schema || mongoose.model<ISchema>("Schema", SchemaSchema);