import React, { Component } from 'react';
import { ethers } from 'ethers';
import '../App.css';
const contractAddress = '0xA28614F5b68F9A5A865DC27fe937edc20d8040be'; // Update this with your contract address
const abi =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "addTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "deleteTask",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"name": "TaskCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"name": "TaskCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "TaskDeleted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "toggleCompleted",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "taskCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Tasks",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] ; // Update this with your contract ABI

export default class Todo extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [],
      currTask: ''
    };
  }

  async componentDidMount() {
    await this.loadTasks();
  }

//   loadTasks = async () => {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const contract = new ethers.Contract(contractAddress, abi, provider);
//     const taskCount = await contract.taskCount();

//     const tasks = [];
//     for (let i = 1; i <= taskCount; i++) {
//       const task = await contract.Tasks(i);
//       tasks.push({ id: task.id.toNumber(), task: task.content, completed: task.completed });
//     }

//     this.setState({ tasks });
//   };
loadTasks = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const taskCount = await contract.taskCount();

    const tasks = [];
    for (let i = 1; i <= taskCount; i++) {
      const task = await contract.Tasks(i);
      tasks.push({ id: task.id.toNumber(), task: task.content, completed: task.completed });
    }

    this.setState({ tasks });
};


  handleChange = (e) => {
    this.setState({
      currTask: e.target.value
    });
  };

  handleSubmit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    await contract.addTask(this.state.currTask);
    await this.loadTasks();

    this.setState({
      currTask: ''
    });
  };

  handleDelete = async (id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    await contract.deleteTask(id);
    await this.loadTasks();
  };

  render() {
    return (
      <div style={{ fontSize: '24px' }} className="center-text">
        <input type="text" value={this.state.currTask} onChange={this.handleChange} />
        <button class="btn" onClick={this.handleSubmit}>Submit</button>
        {this.state.tasks.map((taskObj) => (
          <li key={taskObj.id}>
            <p>{taskObj.task}</p>
            <button class="btn" onClick={() => this.handleDelete(taskObj.id)}>Delete</button>
          </li>
        ))}
      </div>
    );
  }
}
