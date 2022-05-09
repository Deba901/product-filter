import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const App = () => {
  const [date, setDate] = useState([]);
  const [showFilter, setShowFilter] = useState(true)
  const [filter, setFilter] = useState({
    isfilterActive: false,
    filterType: "",
  });

  const chnageFilter = () => {
    setShowFilter(false)
    setFilter({ ...filter, isfilterActive: true });
  };

  const onFilterChange = (e) => {
    console.log("filter clicked.....", e.target.value);
    setFilter({ ...filter, filterType: e.target.value });
  };

  const onDateChange = (e) => {
    setFilter({
      ...filter,
      date: moment(e.target.value).format("YYYY-MM-DD"),
    });
    getProduct(moment(e.target.value).format("YYYY-MM-DD"));
  };

  const onMonthChange = (e) => {
    setFilter({
      ...filter,
      month: moment(e.target.value).format("MM"),
    });
    getProduct(moment(e.target.value).format("MM"));
  };


  const onProductTypeChange = (e) => {
    setFilter({
      ...filter,
      prod_type: e.target.value,
    });
    getProduct(e.target.value);
  };
  const onVendorChange = (e) => {
    setFilter({
      ...filter,
      selected_vendor: e.target.value,
    });
    getProduct(e.target.value);
  };

  const closeFilter = (e) => {
    setFilter({ isfilterActive: false });
    getProduct();
    setShowFilter(!showFilter)
  };

  const getProduct = async (date) => {
    try {
      let tempArr = [];
      const response = await axios.get("https://fanjoy.co/products.json");
      var prodType = response?.data?.products.map(el => {
        return el?.product_type
      })
      var vendors = response?.data?.products.map(el => {
        return el?.vendor
      })
      const unique = [...new Set(prodType)]
      const uniqueVendors = [...new Set(vendors)]
      if(!showFilter){
        setFilter((prevState)=>{
         return  {...prevState,uniqueProductType : unique.filter(el=>el !== ""),vendorList:uniqueVendors }
        })
      }
      if (filter?.isfilterActive && filter?.filterType === "1" && date) {
        tempArr =  response?.data?.products?.filter(
          (el) => el?.product_type === date
        )
          ?.map((el) => {
            return {
              id: el.id,
              created_at: moment(el.created_at).utc().format("YYYY-MM-DD"),
              product_type: el.product_type,
              vendor: el.vendor,
            };
          });
      }
      if (filter?.isfilterActive && filter?.filterType === "2" && date) {
        tempArr = response?.data?.products
          ?.filter(
            (el) => moment(el.created_at).utc().format("YYYY-MM-DD") === date
          )
          ?.map((el) => {
            return {
              id: el.id,
              created_at: moment(el.created_at).utc().format("YYYY-MM-DD"),
              product_type: el.product_type,
              vendor: el.vendor,
            };
          });
      }
      if (filter?.isfilterActive && filter?.filterType === "3" && date) {
        tempArr = response?.data?.products
          ?.filter(
            (el) => moment(el.created_at).utc().format("MM") === date
          )
          ?.map((el) => {
            return {
              id: el.id,
              created_at: moment(el.created_at).utc().format("YYYY-MM-DD"),
              product_type: el.product_type,
              vendor: el.vendor,
            };
          });
      }
      if (filter?.isfilterActive && filter?.filterType === "4" && date) {
        tempArr = response?.data?.products
          ?.filter(
            (el) => el?.vendor === date
          )
          ?.map((el) => {
            return {
              id: el.id,
              created_at: moment(el.created_at).utc().format("YYYY-MM-DD"),
              product_type: el.product_type,
              vendor: el.vendor,
            };
          });
      }
      if (showFilter) {
        tempArr = response?.data?.products.map((el) => {
          return {
            id: el.id,
            created_at: moment(el.created_at).utc().format("YYYY-MM-DD"),
            product_type: el.product_type,
            vendor: el.vendor,
          };
        });
      }

      setDate(tempArr);
    } catch (err) {
      console.log("error", err);
    }
  };

  console.log("state>>", filter);

  useEffect(() => {
    getProduct();
  }, [filter?.filterType,showFilter]);

  return (
    <>
      <div className="p-5">
        {showFilter && (
          <button className="btn btn-primary my-3" onClick={chnageFilter}>
          Filters
        </button>
        )}
        
        {filter?.isfilterActive && (
          <div className="d-flex">
            <select
              className="form-control w-25 mb-5"
              onChange={onFilterChange}
            >
              <option disabled selected>
                select filter
              </option>
              <option value="1">Product Type wise</option>
              <option value="2">Date wise</option>
              <option value="3">Month wise</option>
              <option value="4">Vendor wise</option>
            </select>
            {filter?.filterType === "1" && (
               <select
               className="form-control w-25 mb-5 mx-3"
               onChange={onProductTypeChange}
             >
               <option disabled selected>
                 select product type
               </option>
               {filter?.uniqueProductType?.map((el,i) => (
                  <option key={i} value={el}>{el}</option>
               ))}
             </select>
            )}
            {filter?.filterType === "2" && (
              <div className="mx-3 w-25">
                <input
                  onChange={onDateChange}
                  type="date"
                  className="form-control"
                />
              </div>
            )}
               {filter?.filterType === "3" && (
              <div className="mx-3 w-25">
                <input
                  onChange={onMonthChange}
                  type="month"
                  className="form-control"
                />
              </div>
            )}
             {filter?.filterType === "4" && (
               <select
               className="form-control w-25 mb-5 mx-3"
               onChange={onVendorChange}
             >
               <option disabled selected>
                 select vendor
               </option>
               {filter?.vendorList?.map((el,i) => (
                  <option key={i} value={el}>{el}</option>
               ))}
             </select>
            )}
            <button className="btn btn-danger h-50 ms-3" onClick={closeFilter}>
              Close Filter
            </button>
            {date?.length > 0 &&  <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button h-50 btn btn-success ms-3"
              table="table-to-xls"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />}
           
          </div>
        )}
      
          {date ? (
            <table class="table" id="table-to-xls">
              <thead>
               
                 {filter?.filterType === "1" && (
                  <tr className="bg-dark text-white">
                    <th className="text-warning" scope="col">Product type</th>
                    <th>{filter?.prod_type || date[0]?.product_type}</th>
                    <th className="text-warning" scope="col">Total Product</th>
                    <td>
                      <strong>{date?.length}</strong>
                    </td>
                  </tr>
                )}
                 {filter?.filterType === "2" && (
                  <tr className="bg-dark text-white">
                    <th className="text-warning" scope="col">Date</th>
                    <th>{filter?.date || date[0]?.created_at}</th>
                    <th className="text-warning" scope="col">Total Product</th>
                    <td>
                      <strong>{date?.length}</strong>
                    </td>
                  </tr>
                )}
                {filter?.filterType === "3" && (
                  <tr className="bg-dark text-white">
                    <th className="text-warning" scope="col">Month</th>
                    <th>{moment(date[0]?.created_at).format("MMMM")}</th>
                    <th className="text-warning" scope="col">Total Product</th>
                    <td>
                      <strong>{date?.length}</strong>
                    </td>
                  </tr>
                )}
                
                  {filter?.filterType === "4" && (
                  <tr className="bg-dark text-white">
                    <th className="text-warning" scope="col">Vendor</th>
                    <th>{date[0]?.vendor}</th>
                    <th className="text-warning" scope="col">Total Product</th>
                    <td>
                      <strong>{date?.length}</strong>
                    </td>
                  </tr>
                )}
               {(filter?.filterType === "1" || filter?.filterType === "2" || filter?.filterType === "3" || filter?.filterType === "4") && (
                  <tr>
                  <th scope="col">Sl.no</th>
                  <th scope="col">Created date</th>
                  <th scope="col">Product Type</th>
                  <th scope="col">Vendor</th>
                </tr>
               )}
              </thead>
              {date?.map((el, i) => (
                <tbody>
                  <tr>
                    <th scope="row">{i + 1}</th>
                    <td>{el?.created_at}</td>
                    <td>{el?.product_type === "" ? <span className="text-danger">Not available!</span>:el?.product_type}</td>
                    <td>{el?.vendor}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : null}
          {date?.length === 0 && (
            <h5 className="w-100 my-5 text-center">No Record Found</h5>
          )}
      </div>
    </>
  );
};

export default App;
