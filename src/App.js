import React from 'react';
import firebase from './Firebase';
import { Link } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      processList: [],
      checked: [],
      expanded: [],
      selectedProcessList: [],
      paginationCount: 5,
      currentPage: 1,
      totalPageNo: 0,
    };
  }
  async componentDidMount() {
    // getting all process tree
    const processList = await this.getAllProcess();
    this.setState({
      processList: processList
    });

    // getting all product that user select
    const productList = await this.getAllProduct();
    const selectedProcessList = this.getAllSelectedProcess(processList, productList);
    this.setState({
      selectedProcessList: selectedProcessList,
      totalPageNo: (selectedProcessList.length % this.state.paginationCount) === 0 ?
        parseInt(selectedProcessList.length / this.state.paginationCount) :
        parseInt(selectedProcessList.length / this.state.paginationCount) + 1
    });
  }

  /**
   * This is to get process tree from firestore.
   * @returns processList
   */
  async getAllProcess() {
    const processList = [];
    const snapshot = await firebase.firestore().collection('process').get();
    snapshot.forEach(doc => {
      processList.push(doc.data());
    });
    return processList;
  }

  /**
   * This is to get all procduct versions that user selected.
   * @returns productList
   */
  async getAllProduct() {
    const productList = [];
    const snapshot = await firebase.firestore().collection('product').get();
    snapshot.forEach(doc => {
      productList.push(doc.data().value);
    });
    return productList;
  }

  /**
   * This is to get all selected process version.
   * @param {array} processList processList
   * @param {array} selectedVersionList user selected sub version list
   * @returns selected version list with process information
   */
  getAllSelectedProcess(processList, selectedVersionList) {
    const selectedProcessList = [];
    processList.forEach(process => {
      process.children.forEach(subProcess => {
        subProcess.children.forEach(subProcessVersion => {
          if (selectedVersionList.includes(subProcessVersion.value)) {
            selectedProcessList.push(
              {
                process_title: {
                  value: process.value,
                  label: process.label
                },
                sub_process: {
                  value: subProcess.value,
                  label: subProcess.label
                },
                sub_process_version: {
                  value: subProcessVersion.value,
                  label: subProcessVersion.label
                },
              }
            )
          }
        });
      });
    });
    return selectedProcessList;
  }

  /**
   * This is to delete Product.
   * @param {Event} event event
   * @param {string} version sub version
   */
  deleteProduct = async (event, version) => {
    event.preventDefault();
    if(!window.confirm("Are you sure to delete Product?")) {
      return;
    }
    const snapshot = await firebase.firestore().collection('product').where('value', '==', version).get();
    snapshot.forEach(async (doc) => {
      await firebase.firestore().collection('product').doc(doc.id).delete();
      window.location.reload();
    });
  }

  /**
   * This is to edit product.
   * @param {Event} event event
   * @param {string} version sub version
   */
  editProduct = (event, version) => {
    event.preventDefault();
    this.props.history.push("/edit/" + version);
  }

  render() {
    return (
      <div className="container">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">
              Product List
            </h3>
          </div>
          <div className="panel-body">
            <h4><Link to="/register">Add Product</Link></h4>
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>Process Title</th>
                  <th>Sub Process Name</th>
                  <th>Sub Process Version</th>
                  <th colSpan="2">Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.selectedProcessList.slice((
                  (this.state.currentPage - 1) * this.state.paginationCount),
                  this.state.currentPage * this.state.paginationCount).map(process =>
                    <tr key={process.sub_process_version.value}>
                      <td>{process.process_title.label}</td>
                      <td>{process.sub_process.label}</td>
                      <td>{process.sub_process_version.label}</td>
                      <td>
                        <button className="btn btn-primary"
                          onClick={(event) => { this.editProduct(event, process.sub_process_version.value) }}>
                          Edit</button></td>
                      <td>
                        <button className="btn btn-danger"
                          onClick={(event) => { this.deleteProduct(event, process.sub_process_version.value) }}>
                          Delete</button></td>
                    </tr>
                  )}
              </tbody>
            </table>
            <nav aria-label="...">
              <ul className="pagination">
                <li className="page-item">
                  <button className="page-link" onClick={() => {
                    this.setState({
                      currentPage: this.state.currentPage === 1 ?
                        this.state.currentPage : this.state.currentPage - 1
                    })
                  }}>Previous</button>
                </li>
                {Array(this.state.totalPageNo).fill(0).map((empty, index) =>
                  <li className="page-item" key={index}>
                    <button className="page-link" onClick={() => {
                      this.setState({ currentPage: index + 1 })
                    }}>{index + 1}</button></li>
                )}
                <li className="page-item">
                  <button className="page-link" onClick={() => {
                    this.setState({
                      currentPage: this.state.currentPage === this.state.totalPageNo ?
                        this.state.currentPage : this.state.currentPage + 1
                    })
                  }}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
