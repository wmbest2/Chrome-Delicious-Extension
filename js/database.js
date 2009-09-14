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

/**
 * Utility functions
 *
 */
function typeOf(value) {
    var s = typeof value;
    
    if (s === 'object') {
        if (value) {
            if (typeof value.length === 'number' &&
                    !(value.propertyIsEnumerable('length')) &&
                    typeof value.splice === 'function') {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    
    return s;
}

function inherits(base, extension) {
    for (var property in base) {
        try {
            extension[property] = base[property];
        } catch (warning) {}
    }
}

/**
 * Constructor for DeliciousDatabase object
 *
 */

// TODO: The tagged_bookmarks table needs to be kept up-to-date when
// bookmarks are deleted
//
// TODO: Handle when a user account doesn't exist
//
// TODO: Populate tables after they are created
function DeliciousDatabase() {

    inherits(new Subject(), this);

    var username = localStorage.username;
    var password = localStorage.password;

    var that = this;
    
    if (username && password) {
        this.deliciousAPI = new DeliciousAPI(username, password);
    }

    // Setup a callback observer to handle responses from the
    // Delicious API

    var deliciousEventHandler = function() {

        inherits(new Observer(), this);

        this.update = function(response) {
            // TODO: Handle XML parsing here, then dump it into the database
            console.log(response);

            // Remove the event handler
            that.deliciousAPI.removeObserver(this);
        };
    };

    var populateTagsTable = function() {
        // Add an event handler to deal with the response
        that.deliciousAPI.addObserver(new deliciousEventHandler());
        
        // Fetch the XML result from Delicious
        var result = that.deliciousAPI.getTags();
    };

    var populateBookmarksTable = function() {
        // Add an event handler to deal with the response
        that.deliciousAPI.addObserver(new deliciousEventHandler());
        
        // Fetch the XML result from Delicious
        var result = that.deliciousAPI.recent();
    };

    var populateTaggedBookmarksTable = function() {
        // TODO: Populate the database with these values
    };

    // Instantiate the database
    this.database = window.openDatabase("deliciousDatabase", "0.1", "Delicious Database", 250 * 1024);

    if (!this.database) {
        console.log("Error opening database");
    }

    // Create the tables if they don't exist already
    this.database.transaction(function(query) {
        query.executeSql('SELECT COUNT(*) FROM tags',
                         [],
                         function(transaction, result) {
                             console.log('Table exists');
                             populateTagsTable();
                         },
                         function(transaction, error) {
                             transaction.executeSql('CREATE TABLE tags(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(50) UNIQUE)', []);
                             populateTagsTable();
                         });
    });

    this.database.transaction(function(query) {
        query.executeSql('SELECT COUNT(*) FROM tags',
                         [],
                         function(transaction, result) {
                             console.log('Table exists');
                             populateBookmarksTable();
                         },
                         function(transaction, error) {
                             transaction.executeSql('CREATE TABLE bookmarks(id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(50), url VARCHAR(250) UNIQUE)', []);
                             populateBookmarksTable();
                         });
    });

    this.database.transaction(function(query) {
        query.executeSql('SELECT COUNT(*) FROM tags',
                         [],
                         function(transaction, result) {
                             console.log('Table exists');
                             populateTaggedBookmarksTable();
                         },
                         function(transaction, error) {
                             transaction.executeSql('CREATE TABLE tagged_bookmarks(tag FOREIGNKEY REFERENCES tags(id), bookmark FOREIGNKEY REFERENCES bookmarks(id))', []);
                             populateTaggedBookmarksTable();
                         });
    });
}

/**
 * Adds a tag to the database
 *
 * @param name - string Name of tag
 *
 */
DeliciousDatabase.prototype.addTag = function(tag) {

    // Type checking for parameters
    if (!(typeOf(tag) == 'string')) {
        console.log('ERROR: tag not a string');

        return false;
    }

    this.database.transaction(function(query) {
        query.executeSql('INSERT INTO tags(name) VALUES(?)', [tag]);
    });
};

/**
 * Adds a bookmark to the database.
 *
 * @param title - string Title of bookmark
 * @param url - string URL of bookmark
 * @param tags - array List of tags for bookmark
 *
 */
DeliciousDatabase.prototype.addBookmark = function(title, url, tags) {

    // Type checking for parameters
    if (!(typeOf(title) == 'string')) {
        console.log('ERROR: title not a string');

        return false;
    }

    if (!(typeOf(url) == 'string')) {
        console.log('ERROR: url not a string');

        return false;
    }

    if (!(typeOf(tags) == 'array')) {
        console.log('ERROR: tags not an array');

        return false;
    }

    var that = this;

    // If tags weren't provided, default to an empty
    // array
    tags = tags || [];

    // Delicious wants tags in a space-delimited list
    var formattedTags = '';

    for (var tag in tags) {
        formattedTags += (tags[tag] + ' ');
    }

    // Only write to the database if we receive a successful response
    // from Delicious
    if (this.deliciousAPI.add(url, title, formattedTags)) {

        // Write the bookmark to the database
        this.database.transaction(function(query) {
            query.executeSql('INSERT INTO bookmarks(title, url) VALUES(?, ?)', [title, url]);
        });

        // Add each tag to the database, and then create the relational entry
        // in tagged_bookmarks
        for (var tag in tags) {
            // Add the tag to the database
            this.addTag(tags[tag]);

            this.database.transaction(function(query) {
                // Add the tag/bookmark relationship to the tagged_bookmarks table
                query.executeSql('INSERT INTO tagged_bookmarks(tag, bookmark) VALUES((SELECT id FROM tags WHERE name = ?), (SELECT id FROM bookmarks WHERE url = ?))',
                                 [tags[tag], url]);   // Why does this have to be [i - 1]?
            });
        }
    }
};

/**
 * Fetch all bookmarks
 *
 */
DeliciousDatabase.prototype.getAllBookmarks = function() {

    this.database.transaction(function(query) {
        query.executeSql('SELECT * FROM bookmarks', 
                         [], 
                         function(transaction, result) {
                            for (var i = 0; i < result.rows.length; i++) {
                                // TODO: Return this value
                                that.notify(result.rows.item(i).title);
                            }
                         });
    }); 
};

/**
 * Fetch all bookmarks with a given tag
 *
 * @param tag - string Tag to query for
 *
 */
DeliciousDatabase.prototype.getBookmarksByTag = function(tag) {

    var that = this;

    // Type checking for parameters
    if (!(typeOf(tag) == 'string')) {
        console.log('ERROR: tag not a string');

        return false;
    }

    this.database.transaction(function(query) {
        query.executeSql('SELECT b.title,b.url FROM bookmarks AS b, tags AS t, tagged_bookmarks AS j WHERE b.id = j.bookmark AND t.id = j.tag AND t.name = ?', 
                         [tag],
                         function(transaction, result) {
                            for (var i = 0; i < result.rows.length; i++) {
                                // Return this value
                                that.notify(result.rows.item(i).title);
                            }
                         },
                         function(transaction, error) {
                             console.log(error);
                         });
    });
};

/**
 * Method for writing out a user
 *
 * @param username - string Username
 * @param password - string Password
 *
 * TODO: This seems to make more sense as two localStorage values,
 * not database values
 */
DeliciousDatabase.prototype.setupUser = function(username, password) {

    // Type checking for parameters
    if (!(typeOf(username) == 'string')) {
        console.log('ERROR: username not a string');

        return false;
    }

    if (!(typeOf(password) == 'string')) {
        console.log('ERROR: password not a string');

        return false;
    }
    
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    // Configure the Delicous API now that we have the username
    this.deliciousAPI = new DeliciousAPI(localStorage.username, localStorage.password);
};
