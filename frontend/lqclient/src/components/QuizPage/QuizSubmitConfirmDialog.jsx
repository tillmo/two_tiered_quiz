import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export class QuizSubmitConfirmDialog extends Component {
    render() {
        return (
            <div>
                <Dialog
        open={this.props.dialogOpen}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Submit Quiz</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Once the Quiz is submitted you cannot make the changes again.
            Do you want to submit quiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.submitQuiz} color="primary" autoFocus>
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>
            </div>
        )
    }
}

export default QuizSubmitConfirmDialog
