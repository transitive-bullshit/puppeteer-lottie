'use strict'

const fs = require('fs-extra')
const test = require('ava')
const sharp = require('sharp')
const tempy = require('tempy')

const renderLottie = require('.')

test('bodymovin.json single frame png', async (t) => {
  const output0 = tempy.file({ extension: 'png' })

  await renderLottie({
    path: 'fixtures/bodymovin.json',
    output: output0
  })

  const image0 = await sharp(output0).metadata()
  t.is(image0.width, 1820)
  t.is(image0.height, 275)
  t.is(image0.channels, 4)
  t.is(image0.format, 'png')

  await fs.remove(output0)
})

test.only('bodymovin.json single frame jpg', async (t) => {
  const output0 = tempy.file({ extension: 'jpg' })

  await renderLottie({
    path: 'fixtures/bodymovin.json',
    output: output0
  })

  const image0 = await sharp(output0).metadata()
  t.is(image0.width, 1820)
  t.is(image0.height, 275)
  t.is(image0.channels, 3)
  t.is(image0.format, 'jpeg')

  await fs.remove(output0)
})
