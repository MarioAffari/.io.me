// db.ts
import { MongoClient, Collection } from 'mongodb';
import mongoose from 'mongoose';
import User from './models/User';
export class Database {
  private db?: any;
  isConnected(): boolean {
    return this.db ? true : false;
  }

  constructor(private uri: string) { }


  async connect() {
    try {
      await mongoose.connect(this.uri);
      console.log('Connected to MongoDB');
      this.db = mongoose.connection.db;

    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
    }
  }


  getUser(chatId: number): Promise<any> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return User.findOne({ chatId }).exec();
  }


  getCollection(name: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return this.db.collection(name);
  }


  async saveUser(user: any) {
    try {
      console.log(`Saving user to MongoDB`);
      await user.save(); // Save the User instance
      console.log(`Successfully saved user to MongoDB`);
    } catch (err) {
      console.error(`Failed to save user to MongoDB`, err);
    }
  }

  async close() {
    if (this.db) {
      await this.db.close();
    }
  }

 
}