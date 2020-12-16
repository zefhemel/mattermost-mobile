// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import Model, {Associations} from '@nozbe/watermelondb/Model';
import {children, field, immutableRelation, json} from '@nozbe/watermelondb/decorators';

import {MM_TABLES} from '@constants/database';
import Channel from '@typings/database/channel';
import Draft from '@typings/database/draft';
import File from '@typings/database/file';
import PostInThread from '@typings/database/posts_in_thread';
import PostMetadata from '@typings/database/post_metadata';
import Reaction from '@typings/database/reaction';
import User from '@typings/database/user';

const {CHANNEL, DRAFT, FILE, POST, POSTS_IN_THREAD, POST_METADATA, REACTION, USER} = MM_TABLES.SERVER;

/**
 * The Post model is the building block of communication in the Mattermost app.
 */
export default class Post extends Model {
    /** table (entity name) : Post */
    static table = POST;

    /** associations : Describes every relationship to this entity. */
    static associations: Associations = {

        /** A CHANNEL share a 1:N relationship with POST.  One channel can house multiple posts. */
        [CHANNEL]: {type: 'belongs_to', key: 'channel_id'},

        /** A POST has a 1:N relationship with DRAFT.  One post can have multiple drafts */
        [DRAFT]: {type: 'has_many', foreignKey: 'root_id'},

        /** A POST has a 1:N relationship with FILE.  One post can have multiple file attachments */
        [FILE]: {type: 'has_many', foreignKey: 'post_id'},

        /** A POST has a 1:N relationship with POSTS_IN_THREAD.*/
        [POSTS_IN_THREAD]: {type: 'has_many', foreignKey: 'post_id'},

        /** A POST has a 1:N relationship with POST_METADATA.*/
        [POST_METADATA]: {type: 'has_many', foreignKey: 'post_id'},

        /** A POST has a 1:N relationship with REACTION. Several users can react to a post*/
        [REACTION]: {type: 'has_many', foreignKey: 'post_id'},

        /** A USER has a 1:N relationship with POST.  A user can author several posts*/
        [USER]: {type: 'belongs_to', key: 'user_id'},
    };

    /** channel_id : The foreign key for the Channel to which this post belongs to. */
    @field('channel_id') channelId: string | undefined;

    /** create_at : timestamp to when this post was first created */
    @field('create_at') createAt: number | undefined;

    /** delete_at : timestamp to when this post was last archived/deleted */
    @field('delete_at') deleteAt: number | undefined;

    /** edit_at : timestamp to when this post was last edited */
    @field('edit_at') editAt: number | undefined;

    /** is_pinned : Boolean flag indicating if this Post is pinned */
    @field('is_pinned') isPinned: boolean | undefined;

    /** message : Message in the post */
    @field('message') message: string | undefined;

    /** original_id : Any post will have this value null unless it is updated */
    @field('original_id') originalId: string | undefined;

    /** pending_post_id : The id given to a post before it is published on the server */
    @field('pending_post_id') pendingPostId: string | undefined;

    /** previous_post_id : Id of the previous post.  If this value is null, this implies that it
     * is not in the db and we will request it from server */
    @field('previous_post_id') previousPostId: string | undefined;

    /** root_id : Used in threads. All posts under a thread will have this id in common */
    @field('root_id') rootId: string | undefined;

    /** type : Type of props (e.g. system message) */
    @field('type') type: string | undefined;

    /** user_id : The foreign key of the User who authored this post. */
    @field('user_id') userId: string | undefined;

    /** props : Additional attributes for this props */
    @json('props', (rawJson) => rawJson) props: string[] | undefined;

    /** drafts  : Every drafts associated with this Post */
    @children(DRAFT) drafts: Draft | undefined;

    /** files: All the files associated with this Post */
    @children(FILE) files: File | undefined;

    /** postsInThread: Every posts associated to a thread */
    @children(POSTS_IN_THREAD) postsInThread: PostInThread | undefined;

    /** metadata: All the extra data associated with this Post */
    @children(POST_METADATA) metadata: PostMetadata | undefined;

    /** reactions: All the reactions associated with this Post */
    @children(REACTION) reactions: Reaction | undefined;

    /** author: The author of this Post */
    @immutableRelation(USER, 'user_id') author: User | undefined;

    /** channel: The channel which is presenting this Post */
    @immutableRelation(CHANNEL, 'channel_id') channel: Channel | undefined;
}
