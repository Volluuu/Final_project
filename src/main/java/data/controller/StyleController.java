package data.controller;

import data.dto.CommentDto;
import data.dto.StyleDto;
import data.mapper.MyStyleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/style")
public class StyleController {

	@Autowired
	MyStyleMapper mapper;

	@GetMapping("/list/new")
	public List<StyleDto> orderByNew() {
		return mapper.getAllStyleOrderByNew();

	}

	@GetMapping("/list/pop")
	public List<StyleDto> orderByPop() {
		return mapper.getAllStyleOrderByPop();
	}


	//*****************************************************댓글 관련 Controller ****************************************
	@GetMapping("/comment/root")
	public List<CommentDto> get() {return mapper.getAllComment();}

	@GetMapping("/comment/reply")
	public List<CommentDto> getReply(@RequestParam int parent) {return mapper.getReply(parent);}
}