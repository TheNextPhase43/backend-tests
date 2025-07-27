const videosQueryRepo = {
    getVideos(): VideoOutputModel[] {
        const DBVideos: DBVideo[] = [];
        const DBAuthors: DBAuthor[] = [];

        return DBVideos.map((dbVideo) => {
            const dbAuthor = DBAuthors.find(
                (el) => el._id === dbVideo.authorId
            );

            return this._mapDbVideoToOutputModel(dbVideo, dbAuthor!);
        });
    },

    getVideoById(): VideoOutputModel {
        const foundVideo: DBVideo = {
            _id: "123",
            title: "video1",
            authorId: "100",
            banObject: null,
        };

        const foundAuthor: DBAuthor = {
            _id: "100",
            firstName: "John",
            lastName: "Smith",
        };

        return this._mapDbVideoToOutputModel(foundVideo, foundAuthor);
    },

    getBannedVideos(): BannedVideoOutputModel[] {
        const DBVideos: DBVideo[] = [];
        const DBAuthors: DBAuthor[] = [];

        return DBVideos.map((dbVideo) => {
            const dbAuthor = DBAuthors.find(
                (el) => el._id === dbVideo.authorId
            );

            return {
                id: dbVideo._id,
                title: dbVideo.title,
                author: {
                    id: dbAuthor!._id,
                    name:
                        dbAuthor!.firstName +
                        " " +
                        dbAuthor!.lastName,
                },
                // модификация
                banReason: dbVideo.banObject!.banReason,
            };
        });
    },

    _mapDbVideoToOutputModel(
        dbVideo: DBVideo,
        dbAuthor: DBAuthor
    ): VideoOutputModel {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor!._id,
                name: dbAuthor!.firstName + " " + dbAuthor!.lastName,
            },
        };
    },
};

type DBVideo = {
    _id: string;
    title: string;
    authorId: string;
    banObject: null | {
        isBanned: boolean;
        banReason: string;
    };
};

type DBAuthor = {
    _id: string;
    firstName: string;
    lastName: string;
};

export type VideoOutputModel = {
    id: string;
    title: string;
    author: {
        id: string;
        name: string;
    };
};

export type BannedVideoOutputModel = {
    id: string;
    title: string;
    author: {
        id: string;
        name: string;
    };
    banReason: string;
};
