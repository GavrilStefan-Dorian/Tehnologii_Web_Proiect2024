const { sql } = require('../db');

async function getGroup(id, user = null) {
    let group = [];
    if (!user) {
        group = await sql`SELECT * FROM groups WHERE group_id = ${id}`;
    } else {
        group = await sql`SELECT groups.*, 
                          CASE WHEN group_members.group_id IS NOT NULL THEN TRUE ELSE FALSE END AS member 
                          FROM (SELECT * FROM groups WHERE group_id = ${id}) groups
                          LEFT JOIN (SELECT * FROM group_members WHERE user_id = ${user}) group_members 
                          ON group_members.group_id = groups.group_id;`;
    }


    if (!group) return null;
    return group[0];
}

async function getUserGroups(userId) {
    const groups = await sql`SELECT groups.*
                             FROM groups 
                             JOIN group_members ON groups.group_id = group_members.group_id 
                             WHERE group_members.user_id = ${userId};`;
    if (!groups) return null;
    return groups;
}

async function getGroupMembers(groupId) {
    const query = sql`
        SELECT users.*
        FROM groups 
        JOIN group_members ON groups.group_id = group_members.group_id
        JOIN users ON group_members.user_id = users.user_id
        WHERE groups.group_id = ${groupId}
    `;
    
    return query;
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


    const groups = sql`SELECT g.*, gm.member_count
                            FROM groups g
                            JOIN (
                                SELECT group_id, COUNT(user_id) as member_count
                                FROM group_members
                                GROUP BY group_id
                            ) gm ON g.group_id = gm.group_id
                            WHERE g.group_id IN (
                                SELECT group_id
                                FROM group_members
                                WHERE user_id = ${userId}
                            );
                            `;
    if (!groups) return null;
    return groups;
}


async function getPopularGroups() {
    const groups = sql`SELECT groups.*, COUNT(group_members.group_id) as member_count 
                             FROM groups 
                             LEFT JOIN group_members ON groups.group_id = group_members.group_id 
                             GROUP BY groups.group_id 
                             ORDER BY member_count DESC
                             LIMIT 10;`;
    if (!groups) return null;
    return groups;
}

async function getPopularGroupsWithoutUser(userId) {
    const groups = sql`SELECT g.*, COUNT(gm.group_id) as member_count
                            FROM groups g
                            LEFT JOIN group_members gm ON g.group_id = gm.group_id
                            LEFT JOIN group_members ugm ON g.group_id = ugm.group_id AND ugm.user_id = ${userId}
                            WHERE ugm.user_id IS NULL
                            GROUP BY g.group_id
                            ORDER BY member_count DESC
                            LIMIT 10`;
    if (!groups) return null;
    return groups;
}

async function getAllGroups() {
    const groups = sql`SELECT * FROM groups ORDER BY creation_date;`;
    if (!groups) return null;
    return groups;
}


async function joinGroup(userId, groupId) {
    try {
        // Check if  user is already there
        const existingMembership = await sql`SELECT * FROM group_members WHERE user_id = ${userId} AND group_id = ${groupId}`;
        if (existingMembership.length > 0) {
            return { error: 'User is already a member of this group' };
        }

        // Insert 
        await sql`INSERT INTO group_members (user_id, group_id) VALUES (${userId}, ${groupId})`;

        return { message: 'Successfully joined the group' };
    } catch (error) {
        console.error('Error joining group:', error.message);
        throw error;
    }
}

async function leaveGroup(userId, groupId) {
    try {
        const existingMembership = await sql`SELECT * FROM group_members WHERE user_id = ${userId} AND group_id = ${groupId}`;
        if (existingMembership.length === 0) {
            return { error: 'User is not a member of this group' };
        }

        await sql`DELETE FROM group_members WHERE user_id = ${userId} AND group_id = ${groupId}`;

        return { message: 'Successfully left the group' };
    } catch (error) {
        console.error('Error leaving group:', error.message);
        throw error;
    }
}

async function getGroupMembersAndBooks(groupId, status) {
    return sql`
        SELECT 
            u.user_id AS user_id, 
            u.username AS user_name, 
            b.book_id, 
            b.title, 
            b.author, 
            b.description, 
            b.coverimg, 
            brs.status,
            COALESCE(AVG(r.rating), 0) AS boo_rating, 
            COUNT(r.rating) AS boo_numratings
        FROM 
            group_members gm
        JOIN 
            users u ON gm.user_id = u.user_id
        JOIN 
            book_reading_status brs ON u.user_id = brs.user_id
        JOIN 
            books b ON brs.book_id = b.book_id
        LEFT JOIN
            reviews r ON b.book_id = r.book_id
        WHERE 
            gm.group_id = ${groupId}
            AND brs.status = ${status}
        GROUP BY 
            u.user_id, 
            u.username, 
            b.book_id, 
            b.title, 
            b.author, 
            b.description, 
            b.coverimg, 
            brs.status
        ORDER BY 
            u.user_id, 
            b.title;
    `;
}

module.exports = {
    getGroup,
    getUserGroups,
    getUserGroupsData,
    getPopularGroups,
    getPopularGroupsWithoutUser,
    getAllGroups,
    getGroupMembers,
    getGroupMembersCount,
    joinGroup,
    leaveGroup,
    getGroupMembersAndBooks
};
