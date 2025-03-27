import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
     async createComment(@Res() response, @Body() createCommentDto: CreateCommentDto) {
       try {
         const newComment = await this.commentService.createComment(createCommentDto)
         return response.status(HttpStatus.CREATED).json({
           message: 'Comment Created Successfully',
           data: newComment
         })
       } catch (error) {
         return response.status(HttpStatus.BAD_REQUEST).json({
           message: `Comment not created: ${error.message}`,
           error: 'Bad Request'
         })
       }
     }
   
     @Get()
     async findAllComment(@Res() response) {
       try {
         const listeComments = await this.commentService.getAllComment()
         return response.status(HttpStatus.OK).json({
           message: 'Comments disponibles: ',
           data: listeComments
         })
       } catch (error) {
         return response.status(HttpStatus.NOT_FOUND).json({
           message: `Comments non disponibles: ${error.message}`,
           error: 'Not Found'
         }) 
       }
     }
   
     @Get('/:id')
     async findOneComment(@Res() response, @Param('id') id: string) {
       try {
         const CommentID = await this.commentService.getOneComment(id)
         return response.status(HttpStatus.OK).json({
           message: `Comment with ID ${id} is found`,
           data: CommentID
         })
       } catch (error) {
         return response.status(HttpStatus.NOT_FOUND).json({
           message: `Comment with ID ${id} is not found: ${error.message}`,
           error: 'Not Found',
         })
       }
     }
   
     @Put('/:id')
     async updateComment(@Res() response, @Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
       try {
         const updateCommentID = await this.commentService.UpdateComment(id, updateCommentDto)
         return response.status(HttpStatus.OK).json({
           message: `Comment with ID ${id} is updated Successfully`,
           data: updateCommentID
         })
       } catch (error) {
         return response.status(HttpStatus.BAD_REQUEST).json({
           message: `Comment with ID ${id} is not updated: ${error.message}`,
           error: 'Bad Request'  
         })
       }
     }
   
     @Delete('/:id')
     async deleteComment(@Res() response, @Param('id') id: string) {
       try {
         const deleteCommentID = await this.commentService.deleteComment(id)
         return response.status(HttpStatus.OK).json({
           message: `Comment with ID ${id} is deleted Successfully`,
           data: deleteCommentID
         })
       } catch (error) {
         return response.status(HttpStatus.BAD_REQUEST).json({
           message: `Comment with ID ${id} is not deleted: ${error.message}`,
           error: 'Bad Request' 
         })
       }
     }
}
