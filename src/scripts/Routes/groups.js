
const { sendHTML, readFileContents, authenticateToken, requireLogin } = require("../utils");
const Route = require("../route");
const { getUserGroups, getPopularGroups, getGroupMembersCount, getUserGroupsData } = require("../DAOs/groupsDAO");

function buildGroupList(type, groups) {
    let html = `createGroupList("${type}", [`;
    groups.forEach((group, index) => {    
        html += `createGroup("${type}", "${group.group_id}", "${group.name}", "${group.description}", "${group.img}", "${new Date(group.creation_date).toLocaleDateString()}", "${group.member_count}"),`;
    });
    html += ']),';
    return html;
}

const viewGroupsRoute = new Route('/view-groups', 'GET', async (req, res) => {
    try {
        let contents = readFileContents('./public/Pages/view-groups.html', res);
        if (contents === null) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal server error');
            return;
        };
        authenticateToken(req, res, async () => {
            requireLogin(req, res, async () => {
                const userGroups = await getUserGroupsData(req.user.userId);
                const popularGroups = await getPopularGroups();

                let groupsBuilder = "const groupLists = [";
                let popularsBuilder = "const popularLists = [";

                groupsBuilder += buildGroupList("Your Groups", userGroups);
                popularsBuilder += buildGroupList("Popular Groups", popularGroups);

                groupsBuilder += "];";
                popularsBuilder += "];";

                // let groupLists = '';
                // groupLists += buildGroupList("Your Groups", userGroups);
                // // groupLists += buildGroupList("Popular Groups", popularGroups);
                //


                contents = contents.replace("[|groups|]", groupsBuilder);
                contents = contents.replace("[|populars|]", popularsBuilder);

                // contents = contents.replace("<!-- Placeholder for dynamically generated JavaScript -->", `<script>${groupLists}</script>`);
                sendHTML(contents, res);
            });
        });
    } catch (ex) {
        console.log(ex);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal server error');
    }
});

module.exports = { viewGroupsRoute };


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
