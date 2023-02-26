import React from 'react';

const ContactDetailRenderer = (props) => {
 return (
     <div>
       {props.data[props.column.colId]}
     </div>
 );
};

export default ContactDetailRenderer;