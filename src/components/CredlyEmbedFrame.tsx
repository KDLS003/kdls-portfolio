'use client'

import { memo } from 'react'

type CredlyEmbedFrameProps = {
  badgeId: string
  className?: string
}

const CredlyEmbedFrameComponent = ({ badgeId, className }: CredlyEmbedFrameProps) => (
  <div className={`credly-badge-frame ${className ?? ''}`.trim()}>
    <div
      className="credly-badge block h-[340px] w-full"
      data-iframe-width="340"
      data-iframe-height="340"
      data-hide-footer="true"
      data-hide-share="true"
      data-share-badge-id={badgeId}
      data-share-badge-host="https://www.credly.com"
    />
    <span className="credly-badge-overlay" aria-hidden="true" />
  </div>
)

export const CredlyEmbedFrame = memo(CredlyEmbedFrameComponent)

export default CredlyEmbedFrame
