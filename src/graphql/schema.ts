import {
  validateBookmarkTitle,
  validateBookmarkUrl,
  validateFolderId,
} from "../validation/bookmark.validation";

import { validateFolderName } from "../validation/folder.validation";

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import {
  createBookmark,
  deleteBookmark,
  getBookmarkById,
  listBookmarksByFolder,
  updateBookmark,
} from "../services/bookmark.service";

import {
  createFolder,
  deleteFolder,
  getFolderById,
  listFolders,
} from "../services/folder.service";

/**
 * GraphQL representation of a Bookmark.
 */
const BookmarkType = new GraphQLObjectType({
  name: "Bookmark",

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },

    title: {
      type: new GraphQLNonNull(GraphQLString),
    },

    url: {
      type: new GraphQLNonNull(GraphQLString),
    },

    tags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString)),
      ),
    },

    folderId: {
      type: new GraphQLNonNull(GraphQLID),
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),

      resolve: (bookmark) => {
        return bookmark.createdAt.toISOString();
      },
    },
  },
});

/**
 * GraphQL representation of a Folder.
 *
 * A folder exposes its associated bookmarks through the
 * `bookmarks` field.
 */
const FolderType = new GraphQLObjectType({
  name: "Folder",

  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },

    name: {
      type: new GraphQLNonNull(GraphQLString),
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),

      resolve: (folder) => {
        return folder.createdAt.toISOString();
      },
    },

    bookmarks: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BookmarkType)),
      ),

      resolve: (folder: { id: string; createdAt: Date }) => {
  return listBookmarksByFolder(folder.id);
},
    },
  },
});

const QueryType = new GraphQLObjectType({
  name: "Query",

  fields: {
    folders: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(FolderType)),
      ),

      resolve: () => {
        return listFolders();
      },
    },

    folder: {
      type: FolderType,

      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: (_source, args: { id: string }) => {
        return getFolderById(args.id);
      },
    },

    bookmarks: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(BookmarkType)),
      ),

      args: {
        folderId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: (_source, args: { folderId: string }) => {
        return listBookmarksByFolder(args.folderId);
      },
    },

    bookmark: {
      type: BookmarkType,

      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: (_source, args: { id: string }) => {
        return getBookmarkById(args.id);
      },
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",

  fields: {
    createFolder: {
      type: new GraphQLNonNull(FolderType),

      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },

      resolve: (_source, args: { name: string }) => {
  const name = validateFolderName(args.name);

  return createFolder(name);
},
    },

    deleteFolder: {
      type: new GraphQLNonNull(GraphQLID),

      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: async (_source, args: { id: string }) => {
        await deleteFolder(args.id);
        return args.id;
      },
    },

    createBookmark: {
      type: new GraphQLNonNull(BookmarkType),

      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
        },

        url: {
          type: new GraphQLNonNull(GraphQLString),
        },

        tags: {
          type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
        },

        folderId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: (
        _source,
        args: {
          title: string;
          url: string;
          tags?: string[];
          folderId: string;
        },
      ) => {
        const title = validateBookmarkTitle(args.title);
const url = validateBookmarkUrl(args.url);
const folderId = validateFolderId(args.folderId);

return createBookmark({
  title,
  url,
  tags: args.tags,
  folderId,
});
      },
    },

    updateBookmark: {
      type: new GraphQLNonNull(BookmarkType),

      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },

        title: {
          type: GraphQLString,
        },

        url: {
          type: GraphQLString,
        },

        tags: {
          type: new GraphQLList(new GraphQLNonNull(GraphQLString)),
        },

        folderId: {
          type: GraphQLID,
        },
      },

      
      resolve: (
  _source,
  args: {
    id: string;
    title?: string;
    url?: string;
    tags?: string[];
    folderId?: string;
  },
) => {
  const updateData: {
    title?: string;
    url?: string;
    tags?: string[];
    folderId?: string;
  } = {};

  if (args.title !== undefined) {
    updateData.title = validateBookmarkTitle(args.title);
  }

  if (args.url !== undefined) {
    updateData.url = validateBookmarkUrl(args.url);
  }

  if (args.tags !== undefined) {
    updateData.tags = args.tags;
  }

  if (args.folderId !== undefined) {
    updateData.folderId = validateFolderId(args.folderId);
  }

  return updateBookmark(args.id, updateData);
},
    },

    deleteBookmark: {
      type: new GraphQLNonNull(GraphQLID),

      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },

      resolve: async (_source, args: { id: string }) => {
        await deleteBookmark(args.id);
        return args.id;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

