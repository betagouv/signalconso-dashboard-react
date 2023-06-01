import React, {useEffect} from 'react'
import {ConsumerShareReviewEventActions, EventCategories, Matomo} from '../../core/plugins/Matomo'

const TwitterShareButton = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.charset = 'utf-8'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div id="twitter-share-button-container" style={{marginRight: 10}}>
      <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        onClick={() => Matomo.trackEvent(EventCategories.consumerReview, ConsumerShareReviewEventActions.twitter)}
        className="twitter-share-button"
        data-size="large"
        data-text="Merci à @SignalConso @Dgccrf de m&#39;avoir aidé à résoudre mon litige !"
        data-url=" "
        data-lang="fr"
        data-show-count="false"
      >
        Tweet
      </a>
    </div>
  )
}

export default TwitterShareButton
