function genesis() {
  addAnchor();
  debug("Anchor Created")
  return true;
}

//USED IN GENESIS TO AN THE INITIAL ANCHOR

function getMainAchorHash()
{
  var anchorMain = {Anchor_Type:"Anchor_Type",Anchor_Text:""};
  var anchor_main_hash=commit("anchor",anchorMain);
  return anchor_main_hash;
}

function getHashAnchorType(anchor_type)
{
  var anchorType = {Anchor_Type:anchor_type,Anchor_Text:""};
  var anchorTypeHash =makeHash(anchorType);
  return anchorTypeHash;
}

function addAnchor()
{
  var dna = App.DNA.Hash;
  var anchor_main = {Anchor_Type:"Anchor_Type",Anchor_Text:""};
  var anchor_main_hash=commit("anchor",anchor_main);
  commit("anchor_links", {Links:[{Base:dna,Link:anchor_main_hash,Tag:"AnchorLink_to_DNA"}]});
  debug("Anchor_links to DNA: "+JSON.stringify(getLinks(dna,"AnchorLink_to_DNA",{Load:true})));
  return anchor_main_hash;
}

//USED TO CREATE A NEW Anchor_Type
function anchor_type_create(anchor_type)
{
  var anchor_main_hash=getMainAchorHash();
  var new_anchorType= {Anchor_Type:anchor_type,Anchor_Text:""};
  var key=commit("anchor",new_anchorType);
  commit("anchor_links",{Links:[{Base:anchor_main_hash,Link:key,Tag:"Anchor_Type"}]});
  debug("anchor_type_create: "+JSON.stringify(getLinks(anchor_main_hash,"Anchor_Type",{Load:true})));
}

/*
function anchor_create(anchor_type,anchor_text)
{
  debug("ENTERED Anchor Create");
  var new_anchor = {Anchor_Type:anchor_type,Anchor_Text:anchor_text};
  var anchorTypeHash = getHashAnchorType(anchor_type);

  var new_anchorHash=commit("anchor",new_anchor);
  anchor_link(anchorTypeHash,new_anchorHash);
}
*/
/******
CHANGES DONE HERE ARE THE JSON VAR IS PASSED BECAUSE TWO VARIABLES ARE NOT  Alowed to be PASSED in the call();
****/

function anchor_create(new_anchor)
{

  var anchor_type=new_anchor.Anchor_Type;
  var anchor_text=new_anchor.Anchor_Text;
  var new_anchor = {Anchor_Type:anchor_type,Anchor_Text:anchor_text};
  var new_anchorHash=commit("anchor",new_anchor);
  var anchorTypeHash = getHashAnchorType(anchor_type);
  pass=anchor_link(anchorTypeHash,new_anchorHash);
  return pass;
}

function anchor_link(anchor_type,anchor_text)
{

  commit("anchor_links",{Links:[{Base:anchor_type,Link:anchor_text,Tag:"Anchor_Text"}]});
  var pass=getLinks(anchor_type,"Anchor_Text",{Load:true});
  debug("Anchor_Text: "+JSON.stringify(getLinks(anchor_type,"Anchor_Text",{Load:true})));
  return pass;
}

function anchor_update(anchor_type,old_anchorText,new_anchorText)
{
  var oldAnchor={Anchor_Type:anchor_type,Anchor_Text:old_anchorText};
  var oldAnchorHash = makeHash(oldAnchor);

  var newAnchor={Anchor_Type:anchor_type,Anchor_Text:new_anchorText};
  var newAnchorHash = makeHash(newAnchor);

  var anchorTypeHash = getFavouritePosts();

  var updatedAnchor = update("anchor",newAnchorHash,oldAnchorHash);
  debug("Anchor text successfully updated ! New anchor hash : "+updatedAnchor);
  anchor_updatelink(anchorTypeHash,oldAnchorHash,newAnchorHash);
}

function anchor_updatelink(anchorTypeHash,oldAnchorHash,newAnchorHash)
{
  commit("anchorType_links",
         {Links:[
             {Base:anchorTypeHash,Link:oldAnchorHash,Tag:"Anchor_Text",LinkAction:HC.LinkAction.Del},
             {Base:anchorTypeHash,Link:newAnchorHash,Tag:"Anchor_Text"}
         ]});
}

// List all the anchor types linked to from "AnchorType" created in genesis
function anchor_type_list(anchor_type)
{
  var anchor_type_list=[];
  anchor_main_hash=getMainAchorHash();
  var anchor_type=doGetLinkLoad(anchor_main_hash,"");

  for(var j=0;j<anchor_type.length;j++){
    anchor_type_list=push(anchor_type[j]);
  }
return anchor_type_list;
}

/*****
*****/
// helper function to do getLinks call, handle the no-link error case, and copy the returned entry values into a nicer array
function doGetLinkLoad(base, tag) {
    // get the tag from the base in the DHT
    var links = getLinks(base, tag,{Load:true});
    if (isErr(links)) {
        links = [];
    }
    var links_filled = [];
    for (var i=0;i <links.length;i++) {
        var link = {H:links[i].Hash};
        link[tag] = links[i].Entry;
        links_filled.push(link);
    }
    debug("Links Filled:"+JSON.stringify(links_filled));
    return links_filled;
}
// helper function to determine if value returned from holochain function is an error
function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
}


/****Validation***/
function validatePut(entry_type,entry,header,pkg,sources) {
    return validate(entry_type,entry,header,sources);
}
function validateCommit(entry_type,entry,header,pkg,sources) {
    return validate(entry_type,entry,header,sources);
}
// Local validate an entry before committing ???
function validate(entry_type,entry,header,sources) {
//debug("entry_type::"+entry_type+"entry"+entry+"header"+header+"sources"+sources);
    if (entry_type == "anchor_links"||entry_type == "anchor") {
      return true;
    }
    return true
}

function validateLink(linkingEntryType,baseHash,linkHash,tag,pkg,sources){
    // this can only be "room_message_link" type which is linking from room to message
//debug("LinkingEntry_type:"+linkingEntryType+" baseHash:"+baseHash+" linkHash:"+linkHash+" tag:"+tag+" pkg:"+pkg+" sources:"+sources);
if(linkingEntryType=="anchor_links")
return true;


return true;
}
function validateMod(entry_type,hash,newHash,pkg,sources) {return false;}
function validateDel(entry_type,hash,pkg,sources) {return false;}
function validatePutPkg(entry_type) {return null}
function validateModPkg(entry_type) { return null}
function validateDelPkg(entry_type) { return null}
function validateLinkPkg(entry_type) { return null}
