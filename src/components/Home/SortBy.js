import React from "react";

import { Box, MenuItem, TextField } from "@mui/material";

const SORT_BY = [
    {
        value: "upVotes",
        label: "Up Votes",
    },
    {
        value: "downVotes",
        label: "Down Votes",
    },
];

const SortBy = ({ sortBy, handleSortBy }) => {
    return (
        <Box
            display="flex"
            justifyContent="flex-end"
            sx={{ maxWidth: 800, margin: "16px auto" }}
        >
            <TextField
                id="sortBy"
                select
                label="Sort By"
                value={sortBy}
                onChange={handleSortBy}
            >
                {SORT_BY.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
};

export default SortBy;
