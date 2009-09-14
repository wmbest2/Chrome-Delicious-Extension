// Copyright (c) 2009, William Best and Scott Ferguson
// All rights reserved.
// 
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the software nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
// 
// THIS SOFTWARE IS PROVIDED BY WILLIAM BEST AND SCOTT FERGUSON ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL WILLIAM BEST AND SCOTT FERGUSON BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

function DeliciousAPI(username, password) {
    inherits(new Subject(), this);

    this.deliciousURL = 'https://' + username + ':' + password + '@api.del.icio.us/v1/';
}

/**
 * Returns the last time user updated their bookmarks
 *
 */
DeliciousAPI.prototype.update = function() {

    var that = this;

    jQuery.get(this.deliciousURL + 'posts/update',
               function(response) {
                   that.notify(response);
               });
};

/**
 * Add a post to Delicious
 *
 * @param url - URL to add
 * @param title - Title to use for the bookmark
 * @param tags - Space-delimited list of tags for the bookmark
 *
 */
DeliciousAPI.prototype.add = function(url, title, tags) {

    var that = this;

    jQuery.get(this.deliciousURL + 'posts/add',
               {
                   url: url,
                   description: title,
                   tags: tags
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Delete a post from Delicious
 *
 * @param url - URL to delete
 *
 */
DeliciousAPI.prototype.deletePost = function(url) {

    var that = this;

    jQuery.get(this.deliciousURL + 'posts/delete',
               {
                   url: url
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Returns one or more posts on a single day matching the arguments.
 * If no date or URL is given, most recent date will be used.
 *
 */
DeliciousAPI.prototype.getPosts = function() {

    var that = this;

	jQuery.get(this.deliciousURL + 'posts/get', 
               function(response) {
                   that.notify(response);
               });
};

/**
 * Returns a list of the most recent posts, filtered by argument: Max 100
 *
 */
DeliciousAPI.prototype.recent = function() {

    var that = this;

    jQuery.get(this.deliciousURL + 'posts/recent',
               function(response) {
                   console.log(response);
                   that.notify(response);
               });
};

/**
 * Returns a list of dates with the number of posts at each date
 *
 */
DeliciousAPI.prototype.dates = function() {

    var that = this;

	jQuery.get(this.deliciousURL + 'posts/dates', 
               function(response) {
                   that.notify(response);
               });
};

/**
 * Returns all posts.  Call update() to see if this needs to be
 * called at all.
 *
 */
DeliciousAPI.prototype.all = function() {

    var that = this;

	jQuery.get(this.deliciousURL + 'posts/all', 
               function(response) {
                   that.notify(response);
               });
};

/**
 * Returns a change manifest of all posts.  Call update()
 * to see if you need this.
 *
 */
DeliciousAPI.prototype.hash = function() {

    var that = this;

	jQuery.get(this.deliciousURL + 'posts/all', 
               {
                   hash: ''
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Returns a list of popular tags, recommended tags, and
 * network tags for a user
 *
 * @param url - URL for which you'd like suggestions
 *
 */
DeliciousAPI.prototype.suggest = function(url) {

    var that = this;

	jQuery.get(this.deliciousURL + 'posts/suggest', 
               {
                   url: url
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Returns a list of tags and number of times used by a
 * user.
 *
 */
DeliciousAPI.prototype.getTags = function() {

    var that = this;

	jQuery.get(this.deliciousURL + 'tags/get', 
               function(response) {
                   that.notify(response);
               });
};

/**
 * Delete an existing tag
 *
 * @param tag - Tag to delete
 *
 */
DeliciousAPI.prototype.deleteTag = function(tag) {

    var that = this;

	jQuery.get(this.deliciousURL + 'tags/delete', 
               {
                   tag: tag
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Rename an existing tag with a new tag name
 *
 * @param oldTag - Tag to rename
 * @param newTag - New tag name
 *  
 */
DeliciousAPI.prototype.rename = function(oldTag, newTag) {

    var that = this;

	jQuery.get(this.deliciousURL + 'tags/rename', 
               {
                   oldTag: oldTag,
                   newTag: newTag
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Retrieve all of a user's bundles
 *
 */
DeliciousAPI.prototype.bundles = function() {

    var that = this;

	jQuery.get(this.deliciousURL + 'tags/bundles/all', 
               function(response) {
                   that.notify(response);
               });
};

/**
 * Assign a set of tags to a single bundle, wipes away previous
 * settings for bundle
 *
 * @param bundle - Name of the bundle
 * @param tags - Space-delimited list of tags
 *
 */
DeliciousAPI.prototype.set = function(bundle, tags) {

    var that = this;

	jQuery.get(this.deliciousURL + 'tags/bundles/set', 
               {
                   bundle: bundle,
                   tags: tags
               },
               function(response) {
                   that.notify(response);
               });
};

/**
 * Delete a bundle
 *
 * @param bundle - Name of the bundle
 *
 */
DeliciousAPI.prototype.deleteBundle = function(bundle) {

    var that = this;

	jQuery.get(this.deliciousURL + 'tags/bundles/delete', 
               {
                   bundle: bundle
               },
               function(response) {
                   that.notify(response);
               });
};
