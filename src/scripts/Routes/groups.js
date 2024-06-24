
const Route = require("../route");
const { getGroup, getPopularGroupsWithoutUser, getUserGroupsData, joinGroup, leaveGroup, getGroupMembersAndBooks, getGroupMembers } = require("../DAOs/groupsDAO");
const {authenticateToken, requireLogin, readFileContents, getUser, sendHTML} = require("../utils");

function buildGroupList(type, groups) {
    let html = `createGroupList("${type}", [`;
    groups.forEach((group, index) => {    
        html += `createGroup("${type}", "${group.group_id}", "${group.name}", "${group.description}", "${group.img}", "${new Date(group.creation_date).toLocaleDateString()}", "${group.member_count}"),`;
    });
    html += ']),';
    return html;
}


function buildMembersSection(users) {
    let html = ``;
    users.forEach(user => {
        html += `createMember("${user.username}", "${user.user_id}"),`
    });

    return html;
}

function buildUserStatusSection(books) {
    let html = ``;
    const limit = 5;

    books.slice(0, limit).forEach(x => {
        html += `createUserStatus("${x.book_id}", "${x.user_name}", "${x.status}", "${x.user_id}"),`
    });

    const remainingCount = books.length - limit;
    if(remainingCount > 0) {
        html += `createUserStatus("${x.book_id}", "+${remainingBooksCount}", "${x.status}", "${x.user_id}"),`;
    }

    return html;
}


function buildBooksList(books) {
    let html = ``;
    books.forEach(x => {
        html += `createBook("${x.book_id}", "${x.title}", "${x.author}", "${x.coverimg}", "${x.boo_rating}", "${x.boo_numratings}", "${x.status}"),`;
    })

    return html;
}

const viewGroupsRoute = new Route('/view-groups', 'GET', async (req, res) => {
    try {
        let contents = readFileContents('./public/Pages/view-groups.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        }
        authenticateToken(req, res, async () => {
            requireLogin(req, res, async () => {
                const userGroups = await getUserGroupsData(req.user.userId);
                const popularGroups = await getPopularGroupsWithoutUser(req.user.userId);

                let groupsBuilder = "const groupLists = [";
                let popularsBuilder = "const popularLists = [";

                groupsBuilder += buildGroupList("Your Groups", userGroups);
                popularsBuilder += buildGroupList("Popular Groups", popularGroups);

                groupsBuilder += "];";
                popularsBuilder += "];";

                contents = getUser(req, contents);
                contents = contents.replace("[|groups|]", groupsBuilder);
                contents = contents.replace("[|populars|]", popularsBuilder);
                sendHTML(contents, res);
            })
        })
    } catch (ex) {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

// /group-page before,
let groupPageRoute = new Route((req) => {
    const params = req.url.split('/');
    if(params[1] !== "groups")
        return false;
    if(params.length !== 3)
        return false;
    req.groupId = params[2];
    return true;
}, 'GET', async (req, res) => {
        authenticateToken(req, res, () => {
            requireLogin(req, res, async () => {
                let contents = readFileContents('./public/Pages/group-page.html', res);
                if (contents === null) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal server error');
                    return;
                }

                const group = await getGroup(req.groupId);

                let groupBuilder = `const group = ["${group.group_id}", "${group.name}", "${group.description}", "${group.creation_date}", "${group.img}"];`;
                contents = contents.replace("[|group|]", groupBuilder);


                const toReadBooks = await getGroupMembersAndBooks(req.groupId, 'to_read');
                const readingBooks = await getGroupMembersAndBooks(req.groupId, 'reading');
                const finishedBooks = await getGroupMembersAndBooks(req.groupId, 'read');

                let seenBookIds = {};

                const uniqueToReadBooks = toReadBooks.filter(book => {
                    if (seenBookIds[book.book_id]) {
                        return false;
                    } else {
                        seenBookIds[book.book_id] = true;
                        return true;
                    }
                });

                seenBookIds = {}; 
                const uniqueReadingBooks = readingBooks.filter(book => {
                    if (seenBookIds[book.book_id]) {
                        return false;
                    } else {
                        seenBookIds[book.book_id] = true;
                        return true;
                    }
                });

                seenBookIds = {}; 
                const uniqueFinishedBooks = finishedBooks.filter(book => {
                    if (seenBookIds[book.book_id]) {
                        return false;
                    } else {
                        seenBookIds[book.book_id] = true;
                        return true;
                    }
                });

                let toReadBuilder = "const toReadBooks = [";
                toReadBuilder += buildBooksList(uniqueToReadBooks);
                toReadBuilder += "];";
                
                let readingBuilder = "const readingBooks = [";
                readingBuilder += buildBooksList(uniqueReadingBooks);
                readingBuilder += "];";
                
                let finishedBuilder = "const finishedBooks = [";
                finishedBuilder += buildBooksList(uniqueFinishedBooks);
                finishedBuilder += "];";

                contents = contents.replace("[|toReadBooks|]", toReadBuilder);
                contents = contents.replace("[|readingBooks|]", readingBuilder);
                contents = contents.replace("[|finishedBooks|]", finishedBuilder);


                const users = await getGroupMembers(req.groupId);

                let membersBuilder = "const members = [";
                membersBuilder += buildMembersSection(users);
                membersBuilder += "];";

                contents = getUser(req, contents);
                contents = contents.replace("[|members|]", membersBuilder);

                
                let toReadUserBuilder = "const toReadUsers = [";
                toReadUserBuilder += buildUserStatusSection(toReadBooks);
                toReadUserBuilder += "];";
                
                let readingUserBuilder = "const readingUsers = [";
                readingUserBuilder += buildUserStatusSection(readingBooks);
                readingUserBuilder += "];";
                
                let finishedUserBuilder = "const finishedUsers = [";
                finishedUserBuilder += buildUserStatusSection(finishedBooks);
                finishedUserBuilder += "];";

                contents = contents.replace("[|toReadUsers|]", toReadUserBuilder);
                contents = contents.replace("[|readingUsers|]", readingUserBuilder);
                contents = contents.replace("[|finishedUsers|]", finishedUserBuilder);


                sendHTML(contents, res);
            });
        });
    });

 

    // '/groups/:groupId/members'
const joinGroupRoute = new Route((req) => {
    const params = req.url.split('/');
    if(params[1] !== "groups")
        return false;
    if(params.length !== 4)
        return false;
    req.groupId= params[2];
    return true;
}, 'POST', async (req, res) => {
    authenticateToken(req, res, () => {
        requireLogin(req, res, async () => {
            const userId = req.user.userId;
            const groupId = req.groupId;

            try {
                const result = await joinGroup(userId, groupId);
                if (result.error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: result.error }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Joined group successfully' }));
                }
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    });
});

const leaveGroupRoute = new Route((req) => {
    const params = req.url.split('/');
    if(params[1] !== "groups")
        return false;
    if(params.length !== 4)
        return false;
    req.groupId= params[2];
    return true;
}, 'DELETE', async (req, res) => {
    authenticateToken(req, res, () => {
        requireLogin(req, res, async () => {
            const userId = req.user.userId;
            const groupId = req.groupId;

            try {
                const result = await leaveGroup(userId, groupId);
                if (result.error) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: result.error }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Left group successfully' }));
                }
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    });
});

module.exports = {
    viewGroupsRoute,
    groupPageRoute,
    joinGroupRoute,
    leaveGroupRoute
}


// might need these

// const Route = require('../route');
// const { sendFile, sendError, authenticateToken, requireLogin } = require('../utils');
// const { createGroup, getGroups, getGroupById, updateGroup, deleteGroup } = require('../DAOs/groupsDAO');

// const groupsRoute = new Route('/groups', 'GET', (req, res) => {
//     authenticateToken(req, res, () => {
//         requireLogin(req, res, async () => {
//             try {
//                 const groups = await getGroups();
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 res.end(JSON.stringify(groups));
//             } catch (error) {
//                 console.error('Error fetching groups:', error);
//                 sendError(res, 500, 'Internal server error');
//             }
//         });
//     });
// });

// const createGroupRoute = new Route('/groups/create', 'POST', (req, res) => {
//     authenticateToken(req, res, () => {
//         requireLogin(req, res, async () => {
//             const { name, description } = req.body;
//             if (!name || !description) {
//                 sendError(res, 400, 'Name and description are required');
//                 return;
//             }
//             try {
//                 const createdBy = req.user.userId; // Assuming user ID is stored in req.user.userId
//                 createGroup(name, description, createdBy, (error, group) => {
//                     if (error) {
//                         console.error('Error creating group:', error);
//                         sendError(res, 500, 'Internal server error');
//                     } else {
//                         res.writeHead(200, { 'Content-Type': 'application/json' });
//                         res.end(JSON.stringify(group));
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error creating group:', error);
//                 sendError(res, 500, 'Internal server error');
//             }
//         });
//     });
// });

// const getGroupRoute = new Route('/groups/:groupId', 'GET', (req, res) => {
//     authenticateToken(req, res, () => {
//         requireLogin(req, res, async () => {
//             const groupId = req.params.groupId;
//             try {
//                 const group = await getGroupById(groupId);
//                 if (!group) {
//                     sendError(res, 404, 'Group not found');
//                 } else {
//                     res.writeHead(200, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify(group));
//                 }
//             } catch (error) {
//                 console.error('Error fetching group:', error);
//                 sendError(res, 500, 'Internal server error');
//             }
//         });
//     });
// });

// const updateGroupRoute = new Route('/groups/:groupId', 'PUT', (req, res) => {
//     authenticateToken(req, res, () => {
//         requireLogin(req, res, async () => {
//             const groupId = req.params.groupId;
//             const { name, description } = req.body;
//             try {
//                 const updates = { name, description };
//                 const updatedGroup = await updateGroup(groupId, updates);
//                 if (!updatedGroup) {
//                     sendError(res, 404, 'Group not found');
//                 } else {
//                     res.writeHead(200, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify(updatedGroup));
//                 }
//             } catch (error) {
//                 console.error('Error updating group:', error);
//                 sendError(res, 500, 'Internal server error');
//             }
//         });
//     });
// });

// const deleteGroupRoute = new Route('/groups/:groupId', 'DELETE', (req, res) => {
//     authenticateToken(req, res, () => {
//         requireLogin(req, res, async () => {
//             const groupId = req.params.groupId;
//             try {
//                 const deletedGroup = await deleteGroup(groupId);
//                 if (!deletedGroup) {
//                     sendError(res, 404, 'Group not found');
//                 } else {
//                     res.writeHead(200, { 'Content-Type': 'application/json' });
//                     res.end(JSON.stringify(deletedGroup));
//                 }
//             } catch (error) {
//                 console.error('Error deleting group:', error);
//                 sendError(res, 500, 'Internal server error');
//             }
//         });
//     });
// });

// module.exports = {
//     groupsRoute,
//     createGroupRoute,
//     getGroupRoute,
//     updateGroupRoute,
//     deleteGroupRoute,
// };