import React, { useEffect, useState } from "react";
import UpArrow from "../SVG/dropdown";
import { getCollections } from "../../helpers/getterFunctions";
import { NotificationManager } from "react-notifications";

const AdvancedFilter = (props) => {
  const [activeSaleType, setActiveSaleType] = useState(-2);
  const [cols, setCols] = useState([]);
  const [colsAdv, setColsAdv] = useState("");
  const [cFlag, setCFlag] = useState(true);
  const [bFlag, setBFlag] = useState(true);



  useEffect(() => {
    if (props.brandName !== undefined && bFlag) {
      setBFlag(false)
    }
  }, [props.brandName])

  return (
    <div className={`filter mb-5 ${props.togglemode}`}>
      <div className='filtercol'>
        <form>
          <button
            type='button'
            className='drop_down_tlt'
            data-bs-toggle='collapse'
            data-bs-target='#demo'>
            Status <UpArrow />
          </button>
          <div id='demo' className='collapse show'>
            <ul className='status_ul d-flex flex-wrap'>
              <li
                className={`filter_border mr-2 ${activeSaleType === -2 ? "active" : ""
                  }`}
                value='-2'
                onClick={(e) => {
                  props.onAdvSearch({
                    type: "salesType",
                    value: e.target.value,
                  });
                  setActiveSaleType(e.target.value);
                }}>
                All NFTs
              </li>
              <li
                className={`filter_border mr-2 ${activeSaleType === 2 ? "active" : ""
                  }`}
                value='2'
                onClick={(e) => {
                  props.onAdvSearch({
                    type: "salesType",
                    value: e.target.value,
                  });
                  setActiveSaleType(e.target.value);
                }}>
                Not For Sale
              </li>
              <li
                className={`filter_border mr-2 ${activeSaleType === 0 ? "active" : ""
                  }`}
                value='0'
                onClick={(e) => {
                  props.onAdvSearch({
                    type: "salesType",
                    value: e.target.value,
                  });
                  setActiveSaleType(e.target.value);
                }}>
                Buy Now
              </li>
              <li
                className={`filter_border mr-2 ${activeSaleType === 1 ? "active" : ""
                  }`}
                value='1'
                onClick={(e) => {
                  props.onAdvSearch({
                    type: "salesType",
                    value: e.target.value,
                  });
                  setActiveSaleType(e.target.value);
                }}>
                On Auction
              </li>
            </ul>
          </div>

          {/* <button
          type='button'
          className='drop_down_tlt'
          data-bs-toggle='collapse'
          data-bs-target='#demo2'>
          Price <UpArrow />
        </button> */}
          {/* <div id='demo2' className='collapse show'>
          <ul className='status_ul'>
            <li>
              <select
                className='form-select filter_apply filter-text-left'
                aria-label='Default select example'>
                <option selected>$ Australian Dollar (AUD)</option>
                <option value='1'>One</option>
                <option value='2'>Two</option>
                <option value='3'>Three</option>
              </select>
            </li>
            <li>
              <div className='range_input'>
                <input
                  type='text'
                  className='form-control'
                  id='exampleInputPassword1'
                  placeholder='Min'
                />
                <span className='span_class'>to</span>
                <input
                  type='text'
                  className='form-control'
                  id='exampleInputPassword1'
                  placeholder='Max'
                />
              </div>
            </li>
            <li>
              <button type='submit' className='filter_apply'>
                Apply
              </button>
            </li>
          </ul>
        </div> */}
        </form>
      </div>
      <div className='filtercol'>
        <form>
          <button
            type='button'
            className='drop_down_tlt'
            data-bs-toggle='collapse'
            data-bs-target='#demo3'>
            Collections <UpArrow />
          </button>
          <div id='demo3' className='collapse show '>
            <input
              type='text'
              placeholder='Filter'
              className='filter_apply filter-text-left filter_padd mb-3'
              value={colsAdv}
              onChange={async (e) => {
                if (e.target.value.trim() === "") {
                  e.target.value = ""
                }
                setColsAdv(e.target.value);
                if (e.target.value === "") {
                  props.onAdvSearch({ type: "collection", value: "" });
                } else {
                  const reqData = {
                    page: 1,
                    limit: 12,
                    searchText: e.target.value,
                  };
                  try {
                    const col = await getCollections(reqData);
                    setCols(col);
                  } catch (e) {
                    console.log("Error", e);
                  }
                }
              }}
            />
            {cols && cols.length > 0 && colsAdv !== ""
              ? cols.map((i, key) => {
                return (
                  <div className='form-check form-check-inline' key={key}>
                    <input
                      type='radio'
                      id={i.name}
                      name='radio-group'
                      key={i}
                      value={i._id}
                      onChange={(e) => {
                        props.onAdvSearch({
                          type: "collection",
                          value: e.target.value,
                        });
                      }}
                    />
                    <label htmlFor={i.name}>{i.name}</label>
                  </div>
                );
              })
              : ""}
          </div>
        </form>
      </div>
      <div className='filtercol'>
        <button
          type='button'
          className='drop_down_tlt mb-4'
          data-bs-toggle='collapse'
          data-bs-target='#demo4'>
          Categories <UpArrow />
        </button>
        <div id='demo4' className='collapse show'>
          <ul>
            <li className='sub-items'>
              <form action='#' className='checked_form'>
                <div className='form-check form-check-inline'>
                  <input
                    type='radio'
                    id='allCategory'
                    name='radio-group'
                    checked={cFlag}
                    onChange={() => {
                      setCFlag(true);
                      props.onAdvSearch({ type: "category", value: "" });
                    }}
                  />
                  <label htmlFor='allCategory'>All</label>
                </div>
                {props.category.length > 0
                  ? props.category?.map((c, key) => {
                    return (
                      <div className='form-check form-check-inline' key={key}>
                        <input
                          type='radio'
                          id={c.name}
                          name='radio-group'
                          key={c.name}
                          value={c._id}
                          onChange={(e) => {
                            setCFlag(false);
                            props.onAdvSearch({
                              type: "category",
                              value: e.target.value,
                            });
                          }}
                        />
                        <label htmlFor={c.name}>{c.name}</label>
                      </div>
                    );
                  })
                  : ""}
              </form>
            </li>
          </ul>
        </div>
      </div>
      <div className='filtercol'>
        <button
          type='button'
          className='drop_down_tlt mb-4'
          data-bs-toggle='collapse'
          data-bs-target='#demo5'>
          Brands <UpArrow />
        </button>
        <div id='demo5' className='collapse show'>
          <ul>
            <li>
              <form action='#' className='checked_form'>
                <div className='form-check form-check-inline'>
                  <input
                    type='radio'
                    id='allBrands'
                    name='radio-group'
                    checked={bFlag}
                    onChange={() => {
                      if (props.brandName === undefined) {
                        setBFlag(true);
                        props.onAdvSearch({ type: "brand", value: "" });
                      }
                    }
                    }
                  />
                  <label htmlFor='allBrands'>All</label>
                </div>
                {
                  props.brandName ? props.brands.length > 0
                    ? props.brands?.map((b, key) => {
                      return (
                        <div className='form-check form-check-inline' key={key}>
                          <input
                            type='radio'
                            id={b.name}
                            name='radio-group'
                            key={b}
                            value={b._id}
                            checked={
                              b.name === props.brandName
                            }
                            onChange={(e) => {
                              setBFlag(false)
                              props.brandName
                                ? e.preventDefault()
                                :
                                props.onAdvSearch({
                                  type: "brand",
                                  value: e.target.value,
                                })
                            }}
                          />
                          <label htmlFor={b.name}>{b.name}</label>
                        </div>
                      );
                    })
                    : ""
                    :
                    props.brands.length > 0
                      ? props.brands?.map((b, key) => {
                        return (
                          <div className='form-check form-check-inline' key={key}>

                            <input
                              type='radio'
                              id={b.name}
                              name='radio-group'
                              key={b}
                              value={b._id}
                              onChange={(e) => {
                                setBFlag(false);
                                props.onAdvSearch({
                                  type: "brand",
                                  value: e.target.value,
                                });
                              }}
                            />
                            <label htmlFor={b.name}>{b.name}</label>
                          </div>
                        );
                      })
                      : ""}
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilter;
