import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Attendee from '../Attendee';

export default function MuiTable({ cells, items }) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        { cells.map((cell, index) => <TableCell key={index}>{cell}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(attendee => <Attendee key={attendee.id} attendee={attendee} />)}
                </TableBody>
            </Table>
        </TableContainer>                
    )
}