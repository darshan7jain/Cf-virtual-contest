import tags from "../tags";

export const ratingOptions = Array.from({ length: 23 }, (_, i) => 800 + i * 100);

export const topicOptions = ["random", ...tags];
