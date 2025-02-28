/*
 * @file Theme configuration
 */
import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  lang: 'en-US',
  site: 'https://slate-blog-demo.vercel.app',
  avatar: '/avatar.avif',
title: 'Jayde\'s Quarry',
  description: 'Delirious ramblings on game development, 3D modelling, analog photography and more!',
  lastModified: false,
  readTime: true,
  footer: {
    copyright: '© Jayde Callejas',
  },
  socialLinks: [
    {
      icon: 'github',
      link: 'https://github.com/JaydedCompanion/'
    },
    {
      icon: 'artstation',
      link: 'https://www.artstation.com/jaydedcompanion'
    },
    {
      icon: 'bluesky',
      link: 'https://bsky.app/profile/jayde.callejas.xyz'
    },
    {
      icon: 'instagram',
      link: 'https://www.instagram.com/JaydedCompanion/'
    },
    {
      icon: 'mastodon',
      link: 'https://mastodon.gamedev.place/@JaydedCompanion'
    },
    {
      icon: 'in',
      link: 'https://www.linkedin.com/in/jayde-callejas-a958b2202'
    },
]
});