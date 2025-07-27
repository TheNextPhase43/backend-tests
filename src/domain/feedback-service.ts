import { ObjectId } from "mongodb";
import { FeedbackDBType } from "../repositories/db";
import { feedbackRepository } from "../repositories/feedback-repository";

export const feedbackService = {
    async createFeedbackElement(
        inputComment: string,
        userId: ObjectId
    ) {
        // да, тут service layer
        // является по сути просто прослойкой между
        // роутером, и репозиторием
        const newFeedbackElement: FeedbackDBType = {
            feedbackText: inputComment,
            // монгошный айди юзера, который оставил коммент
            userId: userId,
            // монгошный айди коммента
            _id: new ObjectId(),
        };

        return feedbackRepository.createFeedbackElement(
            newFeedbackElement
        );
    },

    async getAllFeedback() {
        const allFeedback = await feedbackRepository.getAllFeedback();
        return allFeedback;
    },
};
