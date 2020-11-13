const express = require('express')
const server = express()
const router = express.Router()

/**
 * Use a middleware function to parse the original URL string
 * and test it against an ARK URI. If there's a match, return
 * the different identifiers to the user. It's bad form to handle
 * routing logic inside middleware but if the API consists only
 * of one lone route, bad form'll suffice.
 */
const ark = (req, res, next) => {
  const { originalUrl } = req

  // Matches /ark:/NAAN/Name[Qualifier]
  const URI = /^\/ark:\/(\d+)\/(\d+)\/(\?+)$/
  const identifiers = originalUrl.match(URI)

  if (identifiers) {
    // re: qualifier - you'll need to do some checks here for '' '?' vs. '??'
    const [, naan, name, qualifier] = identifiers
    res.json({
      naan,
      name,
      qualifier,
    })
    return
  }

  next()
}

/**
 * Anything that doesn't match an ARK URI will be funneled here
 */
const failover = router.use('*', (req, res) => {
  res.status(400).json({
    originalMatch: req.originalUrl,
    parsedMatch: req.url,
  })
})

server.use('*', ark, failover)

module.exports = server
