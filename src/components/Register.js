import React from 'react';
import firebase from '../Firebase';
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../css/Register.css";
import loading from "../resource/loading.gif";
import {
    MdCheckBox,
    MdCheckBoxOutlineBlank,
    MdChevronRight,
    MdKeyboardArrowDown,
    MdAddBox,
    MdIndeterminateCheckBox,
    MdFolder,
    MdFolderOpen,
    MdInsertDriveFile
} from "react-icons/md";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            processList: [],
            checked: [],
            expanded: []
        };
    }

    async componentDidMount() {
        // getting all process tree
        const processList = await this.getAllProcess();
        this.setState({
            processList: processList
        });
        if (this.props.match.params.version) {
            this.setState({
                checked: [this.props.match.params.version]
            });
        }
    }

    /**
     * This is to submit product data.
     * @param {Event} event event
     * @returns none if there is no checked box.
     */
    onSubmit = async (event) => {
        event.preventDefault();
        if (!this.state.checked.length) {
            alert("Please select Process!!!");
            return;
        }
        if(this.props.match.params.version) {
            const snapshot = await firebase.firestore()
                .collection('product').where(
                    'value', '==', this.props.match.params.version).get();
            snapshot.forEach(async (doc) => {
                await firebase.firestore().collection('product').doc(doc.id).delete();
            });
        }
        document.getElementById("loading").style.display = "flex";

        this.state.checked.forEach(
            async (checkedValue, index) => {
                const snapshot = await firebase.firestore()
                    .collection('product').where('value', '==', checkedValue).get();
                snapshot.forEach(async (doc) => {
                    await firebase.firestore().collection('product').doc(doc.id).delete();
                });
                await firebase.firestore().collection('product').add({
                    value: checkedValue
                }).then(() => {
                    if (index === this.state.checked.length) {
                        this.setState({
                            checked: [],
                            expanded: [],
                        });
                        this.props.history.push("/");
                    }
                });
            }
        );
    }

    /**
     * This is to convert one dimensional array to two dimensional array.
     * @param {array} array one dimensional array
     * @param {string} elementsPerSubArray element per sub array (e.g. 5, 10)
     * @returns tmpArrr two dimensional array
     */
    convertOneDArrToTwoArr(array, elementsPerSubArray) {
        var tmpArr = [], index, count;

        for (index = 0, count = -1; index < array.length; index++) {
            if (index % elementsPerSubArray === 0) {
                count++;
                tmpArr[count] = [];
            }
            tmpArr[count].push(array[index]);
        }
        return tmpArr;
    }

    /**
     * This is to get all process tree.
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

    render() {
        // icons for checkbox tree
        const icons = {
            check: <MdCheckBox className="rct-icon rct-icon-check" />,
            uncheck: <MdCheckBoxOutlineBlank className="rct-icon rct-icon-uncheck" />,
            halfCheck: (
                <MdIndeterminateCheckBox className="rct-icon rct-icon-half-check" />
            ),
            expandClose: (
                <MdChevronRight className="rct-icon rct-icon-expand-close" />
            ),
            expandOpen: (
                <MdKeyboardArrowDown className="rct-icon rct-icon-expand-open" />
            ),
            expandAll: <MdAddBox className="rct-icon rct-icon-expand-all" />,
            collapseAll: (
                <MdIndeterminateCheckBox className="rct-icon rct-icon-collapse-all" />
            ),
            parentClose: <MdFolder className="rct-icon rct-icon-parent-close" />,
            parentOpen: <MdFolderOpen className="rct-icon rct-icon-parent-open" />,
            leaf: <MdInsertDriveFile className="rct-icon rct-icon-leaf-close" />
        };
        return (
            <div className="container">
                <div id={"loading"} className="w-100 position-absolute" style={
                    { height: '350px', display: 'none' }}>
                    <img className="m-auto" src={loading} alt="loading..." />
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">
                            Process Registration
                        </h3>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="checkbox-area">
                                <CheckboxTree
                                    nodes={this.state.processList}
                                    checked={this.state.checked}
                                    expanded={this.state.expanded}
                                    onCheck={checked => this.setState({ checked })}
                                    onExpand={expanded => this.setState({ expanded })}
                                    icons={icons}
                                    showNodeIcon={false}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;