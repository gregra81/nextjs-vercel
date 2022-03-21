import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

export default function Attendee({ attendee} ) {
    return( <>
              <TableRow
                key={attendee.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {attendee.firstName} {attendee.lastName}
                </TableCell>
                <TableCell>{attendee.company} / {attendee.title}</TableCell>
                <TableCell>
                    {attendee.summary ? 
                        (<HtmlTooltip
                            title={<React.Fragment>{attendee.summary}</React.Fragment>} >
                            <Button>Bio</Button>
                        </HtmlTooltip>) : (<></>)}
                </TableCell>
              </TableRow>
              </>
    )
  }