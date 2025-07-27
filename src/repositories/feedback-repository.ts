import {
    mongoDbFeedbackCollection,
    FeedbackDBType,
} from "../repositories/db";

export const feedbackRepository = {
    async createFeedbackElement(newFeedbackElement: FeedbackDBType) {
        await mongoDbFeedbackCollection.insertOne(newFeedbackElement);
        return newFeedbackElement;
    },
    async getAllFeedback() {
        const allFeedback = await mongoDbFeedbackCollection
            .find({})
            .toArray();
        return allFeedback;
    },
};
