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
 * Base Observer class
 *
 */
function Observer() {
    
    this.update = function() {
        return;
    }
}

/**
 * Base Subject class
 *
 */
function Subject() {
    
    this.observers = new Array();
}

/**
 * Base notify() function
 *
 */
Subject.prototype.notify = function(context) {
    
    for (var i = 0; i < this.observers.length; i++) {
        this.observers[i].update(context);
    }
};

/**
 * Base addObserver() function
 *
 */
Subject.prototype.addObserver = function(observer) {
    
    if (!observer.update)
        throw 'Error: invalid parameter';

    // Add the observer to the list
    this.observers.push(observer);
};

/**
 * Base removeObserver() function
 *
 */
Subject.prototype.removeObserver = function(observer) {

    if (!observer.update)
        throw 'Error: invalid parameter';
    
    // Remove the observer from the list
    for (var o in this.observers) {
        if (observer == this.observers[o]) {
            this.observers.splice(o, 1);
        }
    }
};
