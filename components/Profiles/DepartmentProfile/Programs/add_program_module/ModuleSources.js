import { Box, FormControlLabel, List, ListItem, ListItemText, Switch, TextField } from "@mui/material";
import BasicSwtich from "../../../../UI/BaiscSwitch";
import { useEffect } from "react";
import AddBook from "./AddBook";
const ModuleSources=(probs)=>{
    let { form, setForm, setFormIsValid, setDisable,modules } = probs;
    const myObject = form.books;
    console.log(myObject);
    useEffect(() => {
        if(myObject.length> 0){
            setFormIsValid((prev)=> {return{...prev ,"MLS":true}});
        }
      }, [form]);
      const onchange=(e)=>{
        setForm((prev) => {
          return { ...prev, [e.target.name]:e.target.value};
        });
      }
      return(
        <>
    <Box
      sx={{
        maxWidth: '100%',
        margin:"0.8rem"
      }}
    >
        <AddBook setForm={setForm}/>    
            <List sx={{ width: '100%',display:"flex",flexDirection:"row",gap:"1rem",flexWrap:"wrap"}}>
                {
                    myObject.map((book)=>{
                        return (
                            <List sx={{backgroundColor:"#F1F1F3",maxWidth:"30%",minWidth:"300px"}}>
                         <ListItem>
                            <ListItemText primary="Source Name" secondary={book.name}/>
                         </ListItem>
                         <ListItem>
                            <ListItemText primary="Book File" secondary={book.url ?<a href={book.url}>File</a>:"-"}/>
                         </ListItem>
                         <ListItem>
                            <ListItemText
                            primary={
                            <FormControlLabel sx={{position:"relative"}}
                            control={<BasicSwtich checked={book.available} sx={{marginLeft:"16px"}}/> }
                            label="Available in library"
                            />
                            }
                            />
                         </ListItem>
                         </List>
                        )
                    })
                }
            </List>
      
    <TextField
          id="outlined-multiline-static"
          label="Online Resources"
          multiline
          rows={4}
          variant="filled"
          onChange={onchange}
          placeholder="URL..."
          fullWidth
        />
   
        </Box>
        </>
      )

}
export default ModuleSources;