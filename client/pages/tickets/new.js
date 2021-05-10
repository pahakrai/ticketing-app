import React, { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewTicket = () =>  {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const  {doRequest, errors}  = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: (data) => Router.push('/')
    });

    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)) {
            return;
        }

        console.log(value);

        setPrice(value.toFixed(2));
    };

    const onSubmit = (event) => {
        event.preventDefault();
        doRequest();
    }

    return (<div>
        <h1>
            Create a Ticket
        </h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}  className="form-control"/>
            </div>
            <div className="form-group">
                <label>Price</label>
                <input 
                    value={price}
                    onBlur={onBlur}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                 />
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>);
}

export default NewTicket;