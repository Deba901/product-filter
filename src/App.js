import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";



const App = () => {
  const [date, setDate] = useState([]);
  const [showFilter, setShowFilter] = useState(true)
  const [custom, setCustom] = useState(false)
  const [url, setUrl] = useState("https://fanjoy.co/products.json")
  const [page, setPage] = useState("1")
  const [limit, setLimit] = useState("30")
  const [filter, setFilter] = useState({
    isfilterActive: false,
    filterType: "0",
  });
  const [chart, setChart] = useState(false)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Date Wise Graph",
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });

  const showChart = () => {
    setChart(true)
  }
  const closeChart = () => {
    setChart(false)
  }


  const [month, setMonth] = useState(moment.months())
  const chnageFilter = () => {
    setShowFilter(false)
    setFilter({ ...filter, isfilterActive: true });
  };

  const onFilterChange = (e) => {
    console.log("filter clicked.....", e.target.value);
    setChart(false)
    setFilter({ ...filter, filterType: e.target.value });
  };
  console.log("moths list in array", month)
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
      month: moment(e.target.value).format("MM YYYY"),
    });
    getProduct(moment(e.target.value).format("MM YYYY"));
  };

  const onYearChange = (e) => {
    setFilter({
      ...filter,
      year: e.target.value,
    });
    getProduct(e.target.value);
  }
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

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
    setFilter({ isfilterActive: false, filterType: "0" });
    getProduct();
    setShowFilter(!showFilter)
    setChart(false)
  };
  const chnageURL = () => {
    setCustom(true)
  }
  const submitClicked = () => {
    getProduct()
  }
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

  const getProduct = async (date) => {
    try {
      let tempArr = [];
      const response = await axios.get(`${url}?page=${page}&limit=${limit}`);
      var prodType = response?.data?.products.map(el => {
        return el?.product_type
      })
      var vendors = response?.data?.products.map(el => {
        return el?.vendor
      })
      var tarikh = response?.data?.products.map(el => {
        return moment(el.created_at).utc().format("YYYY-MM-DD")
      })
      const unique = [...new Set(prodType)]
      const uniqueVendors = [...new Set(vendors)]
      const uniqueTarikh = [...new Set(tarikh)]
      if (!showFilter) {
        setFilter((prevState) => {
          return { ...prevState, uniqueProductType: unique.filter(el => el !== ""), vendorList: uniqueVendors }
        })
      }
      if (filter?.isfilterActive && filter?.filterType === "1" && date) {
        tempArr = response?.data?.products?.filter(
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
            (el) => moment(el.created_at).utc().format("MM YYYY") === date
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
      if (filter?.isfilterActive && filter?.filterType === "5" && date) {
        for (let i = 0; i < months?.length; i++) {
          response?.data?.products
            ?.filter(
              (el) => moment(el.created_at).utc().format("MM YYYY") === `${months[i]} ${date}`
            )?.map((el) => {
              tempArr.push({
                created_at: moment(el.created_at).utc().format("MMMM YYYY"),
                total: response?.data?.products
                  ?.filter(
                    (el) => moment(el.created_at).utc().format("MM YYYY") === `${months[i]} ${date}`
                  )?.length === 0 ? 0 : response?.data?.products
                    ?.filter(
                      (el) => moment(el.created_at).utc().format("MM YYYY") === `${months[i]} ${date}`
                    )?.length,
              });
            });
        }

      }
      if (filter?.isfilterActive && filter?.filterType === "6") {
        for (let i = 0; i < tarikh?.length; i++) {
          response?.data?.products
            ?.filter(
              (el) => moment(el.created_at).utc().format("YYYY-MM-DD") === tarikh[i]
            )?.map((el) => {
              tempArr.push({
                created_at: moment(el.created_at).utc().format("YYYY-MM-DD"),
                total: response?.data?.products
                  ?.filter(
                    (el) => moment(el.created_at).utc().format("YYYY-MM-DD") === tarikh[i]
                  )?.length === 0 ? 0 : response?.data?.products
                    ?.filter(
                      (el) => moment(el.created_at).utc().format("YYYY-MM-DD") === tarikh[i]
                    )?.length,
              });
            });
        }
      }
      if (filter?.isfilterActive && filter?.filterType === "7") {
        for (let i = 0; i < prodType?.length; i++) {
          response?.data?.products
            ?.filter(
              (el) => el?.product_type  === prodType[i]
            )?.map((el) => {
              tempArr.push({
                created_at: el?.product_type,
                total: response?.data?.products
                  ?.filter(
                    (el) => el?.product_type  === prodType[i]
                  )?.length === 0 ? 0 : response?.data?.products
                    ?.filter(
                      (el) => el?.product_type  === prodType[i]
                    )?.length,
              });
            });
        }
      }
      if (filter?.isfilterActive && filter?.filterType === "8") {
        for (let i = 0; i < vendors?.length; i++) {
          response?.data?.products
            ?.filter(
              (el) => el?.vendor === vendors[i]
            )?.map((el) => {
              tempArr.push({
                created_at: el?.vendor,
                total: response?.data?.products
                  ?.filter(
                    (el) => el?.vendor === vendors[i]
                  )?.length === 0 ? 0 : response?.data?.products
                    ?.filter(
                      (el) => el?.vendor === vendors[i]
                    )?.length,
              });
            });
        }
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
        setCustom(false)
      }
      const key = 'created_at';
      const uniqueTemp = [...new Map(tempArr.map(item => [item[key], item])).values()];
      if (filter?.filterType === "5" || filter?.filterType === "6" ||filter?.filterType === "7" ||filter?.filterType === "8") {
        setDate(uniqueTemp)
        setChartData({
          labels: uniqueTemp?.map((item) => item?.created_at),
          datasets: [
            {
              label:(filter?.filterType === "5" && "Month Wise Graph") || (filter?.filterType === "6" && "Date Wise Graph") || (filter?.filterType === "7" && "Product type Wise Graph") || (filter?.filterType === "8" && "Vendor Wise Graph"),
              data: uniqueTemp?.map((item) => item?.total),
            },
          ],
        });
      } else {
        setDate(tempArr);
      }



    } catch (err) {
      console.log("error", err);
    }
  };




  console.log("state>>", filter);
  console.log("date>>>>", date);

  useEffect(() => {
    getProduct();
  }, [filter?.filterType, showFilter]);

  return (
    <>
      <div className="p-5 my-3">
        {showFilter && (
          <div className="d-flex">
            <button className="btn btn-primary my-3" onClick={chnageFilter}>
              Filters
            </button>
            {custom ? <div className="d-flex w-100">
              <div className="mx-3 my-3 w-25">
                <input
                  onChange={(e) => setUrl(e.target.value)}
                  type="text"
                  className="form-control"
                  placeholder="Insert URL"
                />
              </div>
              <div className="mx-3 my-3 w-25">
                <input
                  onChange={(e) => setPage(e.target.value)}
                  type="number"
                  className="form-control"
                  placeholder="Insert page number"
                />
              </div>
              <div className="mx-3 my-3 w-25">
                <input
                  onChange={(e) => setLimit(e.target.value)}
                  type="number"
                  className="form-control"
                  min="1"
                  max="250"
                  placeholder="Insert limit (Default limit- 30)(Max - 250)"
                />
              </div>
              <button className="btn btn-success my-3" onClick={submitClicked}>
                Submit
              </button>
            </div> : <><div className="my-4 mx-4">Results are displaying based on this : <a target="_blank" href={url}>{url}</a></div>  <button className="btn btn-warning my-3" onClick={chnageURL}>
              Custom URL
            </button></>}
          </div>
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
              <option value="5">All Month wise</option>
              <option value="6">All Date wise</option>
              <option value="7">All Product Type</option>
              <option value="8">All Vendor Type</option>
            </select>
            {filter?.filterType === "1" && (
              <select
                className="form-control w-25 mb-5 mx-3"
                onChange={onProductTypeChange}
              >
                <option disabled selected>
                  select product type
                </option>
                {filter?.uniqueProductType?.map((el, i) => (
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
                {filter?.vendorList?.map((el, i) => (
                  <option key={i} value={el}>{el}</option>
                ))}
              </select>
            )}
            {filter?.filterType === "5" && (
              <div className="mx-3 w-25">
                <input type="number"  placeholder="Please enter year" className="form-control" min="1900" max="2099" step="1" onChange={onYearChange} />
              </div>
            )}
            <button className="btn btn-danger h-50 ms-3" onClick={closeFilter}>
              Close Filter
            </button>
            {(date?.length > 0 && chart === false) && <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button h-50 btn btn-success ms-3"
              table="table-to-xls"
              filename="tablexls"
              sheet="tablexls"
              buttonText="Download as XLS"
            />}
            {((filter?.filterType === "5" || filter?.filterType === "6" || filter?.filterType === "7" || filter?.filterType === "8")&& chart === false ) && <button className="btn btn-info text-white h-50 ms-3" onClick={()=>showChart()}>
              Show Chart
            </button>}
           {chart &&  <button className="btn btn-danger h-50 ms-3" onClick={closeChart}>
              Close Chart
            </button>}

          </div>
        )}

        {date && chart === false ? (
          <table class="table" id="table-to-xls">
            <thead>
              {filter?.filterType === "0" && (
                <tr className="bg-dark text-white">
                  <th className="text-warning" scope="col">Product type</th>
                  <th>{filter?.prod_type || date[0]?.product_type}</th>
                  <th className="text-warning" scope="col">Total Product</th>
                  <td>
                    <strong>{date?.length}</strong>
                  </td>
                </tr>
              )}
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
               {filter?.filterType === "7" && (
                <tr className="bg-dark text-white">
                  <th className="text-warning" scope="col">Total Product Type</th>
                  <td>
                    <strong>{date?.length}</strong>
                  </td>
                </tr>
              )}
                {filter?.filterType === "8" && (
                <tr className="bg-dark text-white">
                  <th className="text-warning" scope="col">Total Vendors</th>
                  <td>
                    <strong>{date?.length}</strong>
                  </td>
                </tr>
              )}
              {(filter?.filterType === "0" || filter?.filterType === "1" || filter?.filterType === "2" || filter?.filterType === "3" || filter?.filterType === "4") && (
                <tr>
                  <th scope="col">Sl.no</th>
                  <th scope="col">Created date</th>
                  <th scope="col">Product Type</th>
                  <th scope="col">Vendor</th>
                </tr>
              )}
              {(filter?.filterType === "5") && (
                <tr>
                  <th scope="col">Months</th>
                  <th scope="col">Total Products</th>
                </tr>
              )}
               {(filter?.filterType === "6") && (
                <tr>
                  <th scope="col">Dates</th>
                  <th scope="col">Total Products</th>
                </tr>
              )}
              {(filter?.filterType === "7") && (
                <tr>
                  <th scope="col">Product Types</th>
                  <th scope="col">Total Products</th>
                </tr>
              )}
               {(filter?.filterType === "8") && (
                <tr>
                  <th scope="col">Vendor</th>
                  <th scope="col">Total Products</th>
                </tr>
              )}
            </thead>
            {(filter?.filterType === "0" || filter?.filterType === "1" || filter?.filterType === "2" || filter?.filterType === "3" || filter?.filterType === "4") && date?.map((el, i) => (
              <tbody>
                <tr>
                  <th scope="row">{i + 1}</th>
                  <td>{el?.created_at}</td>
                  <td>{el?.product_type === "" ? <span className="text-danger">Not available!</span> : el?.product_type}</td>
                  <td>{el?.vendor}</td>
                </tr>
              </tbody>
            ))}
            {/* {month.map(() => ( */}
            {(filter?.filterType === "5") && date?.map((el, i) => (
              <tbody>
                <tr>
                  <td>{el?.created_at}</td>
                  <td>{el?.total}</td>
                </tr>
              </tbody>
            ))}
              {(filter?.filterType === "6") && date?.map((el, i) => (
              <tbody>
                <tr>
                  <td>{el?.created_at}</td>
                  <td>{el?.total}</td>
                </tr>
              </tbody>
            ))}
               {(filter?.filterType === "7") && date?.map((el, i) => (
              <tbody>
                <tr>
                  <td>{el?.created_at || <span className="text-danger">Not available!</span>}</td>
                  <td>{el?.total}</td>
                </tr>
              </tbody>
            ))}
             {(filter?.filterType === "8") && date?.map((el, i) => (
              <tbody>
                <tr>
                  <td>{el?.created_at || <span className="text-danger">Not available!</span>}</td>
                  <td>{el?.total}</td>
                </tr>
              </tbody>
            ))}

            {/* ))} */}

          </table>
        ) : null}
        {date?.length === 0 && (
          <h5 className="w-100 my-5 text-center">No Record Found</h5>
        )}
        {chart && <div className="row px-5 d-flex justify-content-center">
          <div className="col-md-10">
            <Bar data={chartData} />
          </div>
        </div>}
      </div>
    </>
  );
};

export default App;
