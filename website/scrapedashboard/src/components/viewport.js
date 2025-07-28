import React from 'react';

const Viewport = ({subtitle, content})=>{
    return (
        <div className="Viewport">
            <h3>
                {subtitle}
            </h3>
            <p>
                {content}
            </p>
        </div>
    )
}

export default Viewport;