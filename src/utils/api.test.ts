import type { Release } from 'src/types/api';
import { assert, describe, it } from 'vitest';
import { isLinux, isMac, isWin, toCounts, toDownloads } from './api';

describe('api', () => {
	describe('isMac|Win|Linux', () => {
		it('isLinux - *.deb', () => {
			const path =
				'https://github.com/thorchain/asgardex-electron/releases/download/v0.13.0/ASGARDEX-0.13.0-linux.deb';
			assert.isTrue(isLinux(path));
		});
		it('isLinux - *.AppImage', () => {
			const path =
				'https://github.com/thorchain/asgardex-electron/releases/download/v0.15.2/ASGARDEX-0.15.2-linux.AppImage';
			assert.isTrue(isLinux(path));
		});

		it('isMac - *.dmg', () => {
			const path =
				'https://github.com/thorchain/asgardex-electron/releases/download/v1.16.0/ASGARDEX-1.16.0-mac.dmg';
			assert.isTrue(isMac(path));
		});

		it('isMac - *.dmg.blockmap', () => {
			const path =
				'https://github.com/thorchain/asgardex-electron/releases/download/v1.16.0/ASGARDEX-1.16.0-mac.dmg.blockmap';
			assert.isFalse(isMac(path));
		});

		it('isWin - *.exe', () => {
			const path =
				'https://github.com/thorchain/asgardex-electron/releases/download/v1.16.0/ASGARDEX-1.16.0-win.exe';
			assert.isTrue(isWin(path));
		});
	});

	describe('toDownloads', () => {
		it('merge two releases and ignore draft', () => {
			const releases: Array<
				Pick<Release, 'draft' | 'html_url' | 'tag_name' | 'published_at' | 'assets'>
			> = [
				{
					draft: true,
					tag_name: 'name-releaseA',
					published_at: new Date(),
					html_url: 'url-releaseA',
					assets: [
						{
							name: 'file.dmg',
							download_count: 1,
							browser_download_url: '',
							created_at: new Date()
						}
					]
				},
				{
					draft: false,
					tag_name: 'name-releaseB',
					published_at: new Date(),
					html_url: 'url-releaseB',
					assets: [
						{
							name: 'file.dmg',
							download_count: 1,
							browser_download_url: '',
							created_at: new Date()
						},
						{
							name: 'file.deb',
							download_count: 1,
							browser_download_url: '',
							created_at: new Date()
						},
						{
							name: 'file.AppImage',
							download_count: 1,
							browser_download_url: '',
							created_at: new Date()
						},
						{
							name: 'file.exe',
							download_count: 1,
							browser_download_url: '',
							created_at: new Date()
						}
					]
				},
				{
					draft: false,
					tag_name: 'name-releaseC',
					published_at: new Date(),
					html_url: 'url-releaseC',
					assets: [
						{
							name: 'file.dmg',
							download_count: 2,
							browser_download_url: '',
							created_at: new Date()
						},
						{
							name: 'file.deb',
							download_count: 2,
							browser_download_url: '',
							created_at: new Date()
						},
						{
							name: 'file.AppImage',
							download_count: 1,
							browser_download_url: '',
							created_at: new Date()
						},
						{
							name: 'file.exe',
							download_count: 2,
							browser_download_url: '',
							created_at: new Date()
						}
					]
				}
			];

			const result = toDownloads(releases);
			assert.equal(result.length, 2);
		});
	});
	describe('toCounts', () => {
		it('merge linux assets', () => {
			const assets = [
				{
					name: 'file.dmg',
					download_count: 1
				},
				{
					name: 'file.deb',
					download_count: 1
				},
				{
					name: 'file.AppImage',
					download_count: 1
				},
				{
					name: 'file.exe',
					download_count: 1
				}
			];
			assert.deepEqual(toCounts(assets), {
				mac: 1,
				win: 1,
				linux: 2
			});
		});
	});
});
