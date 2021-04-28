import { StructuredText, Image } from "react-datocms";
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
                return <ResponsiveImage img={record.image.responsiveImage} />;
              case "VideoBlockRecord":
                return <ReactPlayer url={record.video.url} controls="true" />
              case "SoundcloudBlockRecord":
                return <ReactPlayer
                  url={record.url}
                  controls="true"
                />

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
