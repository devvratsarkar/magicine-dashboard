import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PageHeader = (props) => {
  return (
    <div className=''>
      <div className="page-header">
        <div>
          <h1 className="page-title">{props.titles}</h1>
          <Breadcrumb>
            {props.items.map((value, index) => {
              const link = props.links ? props.links[index] : null;

              if (typeof link === "function") {
                // If the link is a function, use a button to trigger it
                return (
                  <Breadcrumb.Item key={index} className="breadcrumb-item">
                    <button styl onClick={link} style={{ background: "none", border: "none", cursor: "pointer", color: "#293896" }}>
                      {value}
                    </button>
                  </Breadcrumb.Item>
                );
              } else if (typeof link === "string") {
                return (
                  <Breadcrumb.Item key={index} className="breadcrumb-item">
                    <Link to={link}>{value}</Link>
                  </Breadcrumb.Item>
                );
              } else {
                return (
                  <Breadcrumb.Item key={index} className="breadcrumb-item">
                    {value}
                  </Breadcrumb.Item>
                );
              }
            })}
            <Breadcrumb.Item className="breadcrumb-item active" aria-current="page">{props.active}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
