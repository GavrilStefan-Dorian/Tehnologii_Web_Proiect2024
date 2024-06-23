const { sql } = require('../db');

async function getGroup(id, user = null) {
    let group = [];
    if (!user) {
        group = sql`SELECT * FROM groups WHERE group_id = ${id}`;
    } else {
        group = sql`SELECT groups.*, 
                          CASE WHEN group_members.group_id IS NOT NULL THEN TRUE ELSE FALSE END AS member 
                          FROM (SELECT * FROM groups WHERE group_id = ${id}) groups
                          LEFT JOIN (SELECT * FROM group_members WHERE user_id = ${user}) group_members 
                          ON group_members.group_id = groups.group_id;`;
    }

    if (!group) return null;
    return group[0];
}

async function getUserGroups(userId) {
    const groups = sql`SELECT groups.*
                             FROM groups 
                             JOIN group_members ON groups.group_id = group_members.group_id 
                             WHERE group_members.user_id = ${userId};`;
    if (!groups) return null;
    return groups;
}

async function getGroupMembersCount(id) {
    const groups = sql`SELECT COUNT(*) as member_count 
                             FROM groups 
                             JOIN group_members ON groups.group_id = group_members.group_id 
                             WHERE groups.group_id = ${id}
                            `;
    if (!groups) return null;
    return groups;
}

async function getUserGroupsData(userId) {
    const groups = sql`SELECT groups.*, COUNT(group_members.group_id) as member_count 
                             FROM groups 
                             JOIN group_members ON groups.group_id = group_members.group_id
                             WHERE group_members.user_id = ${userId}
                             GROUP BY groups.group_id;`;
    if (!groups) return null;
    return groups;
}


async function getPopularGroups() {
    const groups = sql`SELECT groups.*, COUNT(group_members.group_id) as member_count 
                             FROM groups 
                             LEFT JOIN group_members ON groups.group_id = group_members.group_id 
                             GROUP BY groups.group_id 
                             ORDER BY member_count DESC;`;
    if (!groups) return null;
    return groups;
}

async function getAllGroups() {
    const groups = sql`SELECT * FROM groups ORDER BY creation_date;`;
    if (!groups) return null;
    return groups;
}

module.exports = {
    getGroup,
    getUserGroups,
    getUserGroupsData,
    getPopularGroups,
    getAllGroups,
    getGroupMembersCount,
};
