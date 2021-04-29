import { StructuredText, Image } from "react-datocms"
import React from 'react'
import ReactPlayer from 'react-player'
import ResponsiveImage from './responsive-image'


export default function PostBody({ content }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="prose prose-lg prose-green">
        <StructuredText
          data={content}
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
              case "SpotifyBlockRecord":
                return <iframe src={record.url} width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              case "PodcastBlockRecord":
                return <iframe
                  allow="autoplay *; encrypted-media *; fullscreen *" frameborder="0"
                  height="175"
                  style={{width:"100%", maxWidth: "660px", overflow: "hidden", background: "transparent"}}
                  sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activationallow-top-navigation-by-user-activation" src={record.url} />
              default:
                return (
                  <>
                    <p>Don't know how to render a block!</p>
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
