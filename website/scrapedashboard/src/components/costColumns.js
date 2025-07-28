import React from 'react';
import Viewport from './viewport';

const CostColumn = ({sections}) =>{
    return (
        <div className="CostColumn">
            {sections.map((section, index)=>(
                <div key={index}>
                    <h2>{section.title}</h2>
                    <Viewport subtitle={section.subtitle} content={section.content}></Viewport>
                </div>
            ))}
        </div>
    )
}

export default CostColumn;