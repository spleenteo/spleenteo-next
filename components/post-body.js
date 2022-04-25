import { StructuredText, Image } from "react-datocms"
import React from 'react'
import ReactPlayer from 'react-player'
import ResponsiveImage from './responsive-image'

const renderInlineRecord = ({ record }) => {
  switch(record.__typename) {
    case 'PostRecord':
      return <a href={ `/posts/${ record.slug }`} title={record.title}>{record.title} </a>
    case 'CategoryRecord':
      return <a href={ `/categories/${ record.slug }`} title={record.name}>{record.title} </a>
    default:
      return ''
  }
}

const renderLinkToRecord = ({ record,children }) => {
  switch(record.__typename) {
    case 'PostRecord':
      return <a href={ `/posts/${ record.slug }`} title={record.title}>{children[0]} </a>
    case 'CategoryRecord':
      return <a href={ `/categories/${ record.slug }`} title={record.name}>{children[0]} </a>
    default:
      return ''
  }
}

export default function PostBody({ content }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="prose prose-lg prose-green">
        <StructuredText
          data={content}
          renderLinkToRecord={ renderLinkToRecord }
          renderInlineRecord={ renderInlineRecord }
          renderBlock={({ record }) => {
            switch (record.__typename) {
              case "ImageBlockRecord":
                return <ResponsiveImage
                  img={record.image.responsiveImage}
                  className="max-w-max mx-auto md:max-w-full"
                />;
              case "VideoBlockRecord":
                return <ReactPlayer
                  url={record.video.url}
                  controls="true"
                  className="max-w-max mx-auto md:max-w-full"
                />
              case "SoundcloudBlockRecord":
                return <ReactPlayer
                  url={record.url}
                  controls="true"
                  className="max-w-max mx-auto md:max-w-full"
                />
              case "IframeBlockRecord":
                return <div className="max-w-max mx-auto md:max-w-full" dangerouslySetInnerHTML={{__html: record.url}} />

              default:
                return (
                  <>
                    <p>Don&apos;t know how to render a block!</p>
                    <pre>{JSON.stringify(record, null, 2)}</pre>
                  </>
                );
            }
          }}
        />
      </div>
    </div>
  );
}
