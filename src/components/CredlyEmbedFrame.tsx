'use client'

import { memo } from 'react'

type CredlyEmbedFrameProps = {
  badgeId: string
  embedHtml?: string
  className?: string
}

const CredlyEmbedFrameComponent = ({ badgeId, embedHtml, className }: CredlyEmbedFrameProps) => (
  <div className={`credly-badge-frame ${className ?? ''}`.trim()}>
    {embedHtml ? (
      <div
        className="credly-badge block h-[340px] w-full [&_.credly-badge-embed]:h-full [&_.credly-badge-embed]:w-full [&_.credly-badge-embed]:max-w-full"
        dangerouslySetInnerHTML={{ __html: embedHtml }}
      />
    ) : (
      <div
        className="credly-badge block h-[340px] w-full"
        data-iframe-width="340"
        data-iframe-height="340"
        data-hide-footer="true"
        data-hide-share="true"
        data-share-badge-id={badgeId}
        data-share-badge-host="https://www.credly.com"
      />
    )}
    <span className="credly-badge-overlay" aria-hidden="true" />
  </div>
)

export const CredlyEmbedFrame = memo(CredlyEmbedFrameComponent)

export default CredlyEmbedFrame
