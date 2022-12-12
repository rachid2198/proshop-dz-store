import React, {useState} from 'react'
import {Button,Form, Col,Row} from 'react-bootstrap'
import {useNavigate,useLocation} from 'react-router-dom'

const SearchBox = () => {
  const [keyword,setKeyword]=useState('') 
  const history= useNavigate() 
  const location=useLocation()

  const submitHandler=(e)=>{
    e.preventDefault()
    if(keyword){
        history(`/?keyword=${keyword}`)
    }else{
        history(location.pathname)
    }
  }

  return (
    <div>
      <Form onSubmit={submitHandler}>
        <Row>
          <Col xs={10}>
            <Form.Control
              type="text"
              name="q"
              onChange={(e) => setKeyword(e.target.value)}
              className="mr-sm-2 ml-sm-5"
            ></Form.Control>
          </Col>

          <Col xs={2}>
            <Button type="submit" variant="outline-success" className="p-2">
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default SearchBox