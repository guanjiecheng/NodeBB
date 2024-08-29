'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const nconf = require('nconf');
const db = require('../mocks/databasemock');

const user = require('../../src/user');
const topics = require('../../src/topics');
const categories = require('../../src/categories');
const file = require('../../src/file');
const utils = require('../../src/utils');

const md5 = filename => crypto.createHash('md5').update(filename).digest('hex');

describe('delete.js', () => {
	describe('.deleteUserFromFollowers()', () => {
		let followerUid;
		let followingUid;

		beforeEach(async () => {
			followerUid = await user.create({
				username: utils.generateUUID(),
				password: utils.generateUUID(),
				gdpr_consent: 1,
			});

			followingUid = await user.create({
				username: utils.generateUUID(),
				password: utils.generateUUID(),
				gdpr_consent: 1,
			});

			await user.follow(followingUid, followerUid);
		});

		it('should remove a user from following when user deletes account ', async () => {
			await user.deleteAccount(followerUid);
			const followers = await db.getSortedSetMembers(`uid:${followingUid}:followers`);
			assert.strictEqual(followers.length, 0);
		});
	});
});
