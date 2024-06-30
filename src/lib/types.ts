export type Media =
	| {
			kind: 'text';
			message: string;
			tag?: string;
	  }
	| {
			kind: 'image';
			url: string;
			alt?: string;
			tag?: string;
	  }
	| {
			kind: 'video';
			url: string;
			tag?: string;
	  };

export type AccountId = string;
export type CommunityId = string;
export type ContentId = string;
export type PlatformId = string;
export type ModeratorId = string;
export type RelevantId = ContentId | AccountId | CommunityId;

export type PossibleAction = {
	id: string;
	display?: string;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
};

export type Account = {
	created?: Date;
	name?: string;
	recentContentIds?: ContentId[];
	possibleActions: PossibleAction[];
};

export type Community = {
	created?: Date;
	name?: string;
	recentContentIds?: ContentId[];
	adminstratorsIds?: AccountId[];
	possibleActions: PossibleAction[];
};

export type Content = {
	created?: Date;
	medias: Media[];
	author?: AccountId;
	community?: CommunityId;
	context?: ContentId[];
	possibleActions: PossibleAction[];
};

export type CustomAction = {
	kind: 'custom';
	id: string;
	display: string;
};

export type DiscussionAction = {
	kind: 'comment';
	text: string;
};

export type PlatformAction =
	// | {
	// 		kind: 'report';
	// 		category?: string;
	// 		additionalInfo?: string;
	//   }
	// | {
	// 		kind: 'appeal';
	// 		reasoning: Media[];
	//   }
	{
		kind: 'requestPublication';
	};

export type ActionDB = {
	platformId: PlatformId;
	relevantId: RelevantId;
	kind: 'content' | 'user' | 'community';
	name?: string;
	createdAt: string;
	actionInfo: string;
};

export type Action = {
	platformId: PlatformId;
	relevantId: RelevantId;
	kindId: 'content' | 'user' | 'community';
	name?: string;
	createdAt: Date;
} & (CustomAction | DiscussionAction | PlatformAction);

export function fixAction(action: ActionDB): Action {
	return {
		...action,
		createdAt: new Date(action.createdAt),
		...(JSON.parse(action.actionInfo) satisfies CustomAction | DiscussionAction | PlatformAction)
	};
}

export type Platform = {
	id: string;
	organizationId: string;
	name: string;
	callbackUrl: string;
	secret: string;
};

export type Orgnaization = {
	id: string;
	name: string;
};

export type CaseDB = {
	platformId: PlatformId;
	relevantId: RelevantId;
	kind: 'content' | 'user' | 'community';
	status: 'unresolved' | 'resolved';
	createdAt: string;
	updatedAt: string;
};

type Modify<T, R> = Omit<T, keyof R> & R;

export type Case = Modify<
	CaseDB,
	{
		createdAt: Date;
		updatedAt: Date;
	}
>;

export function fixCase(givenCase: CaseDB): Case {
	return {
		...givenCase,
		createdAt: new Date(givenCase.createdAt),
		updatedAt: new Date(givenCase.updatedAt)
	};
}
